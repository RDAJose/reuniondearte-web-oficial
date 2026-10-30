"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatSetDate, isMusicSet, isSetPage, type MusicSet, type SetPage } from "@/lib/sets/contracts";
import { parseTracklist } from "@/lib/sets/tracklist";
import styles from "./sets.module.css";

function time(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const value = Math.floor(seconds);
  const hours = Math.floor(value / 3600);
  return `${hours ? `${hours}:` : ""}${hours ? String(Math.floor(value / 60) % 60).padStart(2, "0") : Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

type Props = {
  apiBaseUrl: string;
  initialPage: SetPage;
  archive: Pick<MusicSet, "id" | "title" | "artist">[];
  detailId?: number;
};

export function SetsCatalog({ apiBaseUrl, initialPage, archive, detailId }: Props) {
  const initialActive = detailId ? initialPage.items[0] ?? null : null;
  const [items, setItems] = useState<MusicSet[]>(initialPage.items);
  const [nextCursor, setNextCursor] = useState<number | null>(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [active, setActive] = useState<MusicSet | null>(initialActive);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerError, setPlayerError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeRef = useRef<MusicSet | null>(initialActive);
  const requestRef = useRef<AbortController | null>(null);
  const playAttempt = useRef(0);
  const pendingSeek = useRef<number | null>(null);
  const staticIds = useMemo(() => new Set(archive.map((item) => item.id)), [archive]);
  const tracks = useMemo(() => parseTracklist(active?.tracklist ?? ""), [active?.tracklist]);

  const load = useCallback((cursor: number | null = null) => {
    requestRef.current?.abort();
    const controller = new AbortController(); requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 25000);
    const path = detailId ? `/api/sets/${detailId}` : `/api/sets?limit=12${cursor ? `&before=${cursor}` : ""}`;
    void fetch(`${apiBaseUrl}${path}`, {
        signal: controller.signal, credentials: "omit", cache: "no-store", headers: { Accept: "application/json" },
      }).then(async (response) => {
      if (detailId && response.status === 404) return null;
      if (!response.ok) throw new Error("catalog");
      const body: unknown = await response.json();
      if (detailId) {
        if (!isMusicSet(body) || body.id !== detailId) throw new Error("contract");
        return { items: [body], nextCursor: null };
      }
      if (!isSetPage(body)) throw new Error("contract");
      return body;
    }).then((data) => {
      if (requestRef.current !== controller) return;
      if (data === null) {
        audioRef.current?.pause(); audioRef.current?.removeAttribute("src"); audioRef.current?.load();
        activeRef.current = null; setActive(null); setItems([]); setUnavailable(true);
        return;
      }
      if (detailId && !audioRef.current?.getAttribute("src")) {
        activeRef.current = data.items[0]; setActive(data.items[0]);
      }
      setItems((previous) => cursor ? [...new Map([...previous, ...data.items].map((item) => [item.id, item])).values()] : data.items);
      setNextCursor(data.nextCursor);
    }).catch(() => {
      if (requestRef.current === controller) setCatalogError("No hemos podido actualizar las sesiones. Se conserva la edición disponible; puedes volver a intentarlo.");
    }).finally(() => {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) setLoading(false);
    });
  }, [apiBaseUrl, detailId]);

  function requestPage(cursor: number | null) {
    setLoading(true); setCatalogError("");
    void load(cursor);
  }

  useEffect(() => {
    void load();
    return () => { requestRef.current?.abort(); requestRef.current = null; };
  }, [load]);

  const updatePosition = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const length = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? Math.max(0, audio.currentTime) : 0;
    setDuration(length); setPosition(current);
    if (length && "mediaSession" in navigator && navigator.mediaSession.setPositionState) {
      try { navigator.mediaSession.setPositionState({ duration: length, playbackRate: audio.playbackRate, position: Math.min(current, length) }); }
      catch { /* Partial Media Session implementations must not interrupt playback. */ }
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration));
    updatePosition();
  }, [updatePosition]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !activeRef.current) return;
    const attempt = ++playAttempt.current;
    setPlayerError("");
    if (!audio.getAttribute("src")) { audio.src = activeRef.current.audioUrl; audio.load(); }
    if (audio.error) audio.load();
    if (audio.ended) audio.currentTime = 0;
    // Called synchronously from the user gesture, including when switching sessions on iOS.
    void audio.play().catch((error: unknown) => {
      if (attempt !== playAttempt.current || (error instanceof DOMException && error.name === "AbortError")) return;
      setBuffering(false);
      setPlayerError("No se ha podido reproducir este audio. Comprueba tu conexión y la compatibilidad del navegador con el formato original.");
    });
  }, []);

  function choose(item: MusicSet, startAt?: number) {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeRef.current?.id === item.id) {
      if (startAt !== undefined) {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          if (startAt >= audio.duration) return;
          seek(startAt);
        } else pendingSeek.current = startAt;
        play(); return;
      }
      if (audio.paused) play(); else audio.pause();
      return;
    }
    ++playAttempt.current; audio.pause();
    pendingSeek.current = startAt ?? null;
    activeRef.current = item; setActive(item); setPosition(0); setDuration(0); setPlayerError(""); setBuffering(true);
    audio.src = item.audioUrl;
    audio.load();
    play();
  }

  function metadataLoaded() {
    const audio = audioRef.current;
    const target = pendingSeek.current;
    pendingSeek.current = null;
    if (audio && target !== null && Number.isFinite(audio.duration)) {
      if (target < audio.duration) seek(target);
      else { audio.pause(); setPlayerError("Ese tiempo está fuera de la duración del audio."); }
    }
    updatePosition();
  }

  useEffect(() => {
    if (!active || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    if (typeof MediaMetadata !== "undefined") session.metadata = new MediaMetadata({
      title: active.title, artist: active.artist, album: "SETS · Reunión de Arte",
      artwork: [{ src: active.coverUrl }],
    });
    const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", play], ["pause", () => audioRef.current?.pause()],
      ["seekbackward", (details) => seek((audioRef.current?.currentTime ?? 0) - (details.seekOffset ?? 15))],
      ["seekforward", (details) => seek((audioRef.current?.currentTime ?? 0) + (details.seekOffset ?? 15))],
      ["seekto", (details) => { if (details.seekTime !== undefined) seek(details.seekTime); }],
      ["stop", () => { audioRef.current?.pause(); seek(0); }],
    ];
    for (const [action, handler] of actions) { try { session.setActionHandler(action, handler); } catch { /* Optional browser support. */ } }
    return () => {
      for (const [action] of actions) { try { session.setActionHandler(action, null); } catch { /* Optional browser support. */ } }
      session.metadata = null; session.playbackState = "none";
      try { session.setPositionState?.(); } catch { /* Optional browser support. */ }
    };
  }, [active, play, seek]);

  useEffect(() => {
    if (active && "mediaSession" in navigator) navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [active, playing]);

  useEffect(() => {
    const audio = audioRef.current;
    const attempts = playAttempt;
    return () => { ++attempts.current; audio?.pause(); audio?.removeAttribute("src"); audio?.load(); };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        {detailId && <Link href="/sets/" prefetch={false} className={styles.back}>← Todas las sesiones</Link>}
        <p className="editorial-kicker">Reunión de Arte · Archivo sonoro</p>
        {detailId ? <><h1 className={styles.detailTitle}>{initialActive?.title}</h1><p className={styles.lead}>{initialActive?.artist}</p></>
          : <><h1>SETS<span aria-hidden="true">.</span></h1><p className={styles.lead}>Música para quedarse.</p>
            <p className={styles.description}>Sesiones y selecciones para escuchar con tiempo. Un recorrido, de principio a fin.</p></>}
      </header>

      {unavailable && <p role="status" className={styles.notice}>Esta sesión ya no está disponible en el catálogo.</p>}

      <section className={styles.player} aria-label="Reproductor de sesiones">
        <div className={styles.playerArtwork}>
          {active ? <Image src={active.coverUrl} alt="" width={160} height={160} unoptimized /> : <span aria-hidden="true">R/A<br />SETS</span>}
        </div>
        <div className={styles.playerBody}>
          <p className="editorial-kicker">{active ? "En el reproductor" : "A la escucha"}</p>
          <h2>{active?.title ?? "Elige una sesión"}</h2>
          <p className={styles.artist}>{active?.artist ?? "El sonido empieza cuando tú quieras."}</p>
          <div className={styles.controls}>
            <button type="button" disabled={!active || !duration} aria-label="Retroceder 15 segundos" onClick={() => seek(position - 15)}>−15 s</button>
            <button type="button" className={styles.play} disabled={!active} aria-label={playing ? "Pausar sesión" : "Reproducir sesión"} onClick={() => { if (audioRef.current?.paused) play(); else audioRef.current?.pause(); }}>
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span> {playing ? "Pausa" : "Play"}
            </button>
            <button type="button" disabled={!active || !duration} aria-label="Avanzar 15 segundos" onClick={() => seek(position + 15)}>+15 s</button>
          </div>
          <label className={styles.srOnly} htmlFor="sets-position">Posición de reproducción</label>
          <input id="sets-position" className={styles.timeline} type="range" min="0" max={duration || 1} step="1" value={Math.min(position, duration || 0)} disabled={!duration} aria-valuetext={`${time(position)} de ${time(duration)}`} onChange={(event) => seek(Number(event.target.value))} />
          <div className={styles.times}><span>{time(position)}</span><span>{time(duration)}</span></div>
          <p className={styles.playerStatus} role="status">{playerError || (buffering ? "Cargando audio…" : playing ? "Reproduciendo" : active ? "En pausa" : "Sin reproducción automática")}</p>
        </div>
        <audio ref={audioRef} preload="none" onTimeUpdate={updatePosition} onLoadedMetadata={metadataLoaded} onDurationChange={updatePosition} onSeeked={() => { setBuffering(false); updatePosition(); }}
          onPlay={() => setPlaying(true)} onPlaying={() => { setPlaying(true); setBuffering(false); }}
          onPause={() => { setPlaying(false); setBuffering(false); }} onWaiting={() => setBuffering(true)}
          onEnded={() => { setPlaying(false); setBuffering(false); updatePosition(); }}
          onError={() => { if (activeRef.current) { setPlaying(false); setBuffering(false); setPlayerError("Este audio no está disponible o el navegador no admite su formato original. Inténtalo de nuevo más tarde o en otro navegador."); } }} />
      </section>

      {active && tracks.length > 0 && <section className={styles.tracklist} aria-labelledby="tracklist-title">
        <h2 id="tracklist-title">Tracklist · {active.title}</h2>
        <ol>{tracks.map((track, index) => <li key={index}>
          {track.seconds !== null && track.timestamp !== null
            ? <><button type="button" disabled={duration > 0 && track.seconds >= duration}
              aria-label={`Reproducir desde ${track.timestamp}: ${track.text}`}
              onClick={() => choose(active, track.seconds ?? 0)}>{track.timestamp}</button><span>{track.text}</span></>
            : <span>{track.text}</span>}
        </li>)}</ol>
      </section>}

      <section aria-labelledby="sets-catalog-title" className={styles.catalog}>
        <div className="section-heading"><h2 id="sets-catalog-title">{detailId ? "Sobre esta sesión" : "Las sesiones"}</h2><span className={styles.caption}>Selección de Reunión de Arte</span></div>
        {loading && !items.length && <p role="status" className={styles.notice}>Cargando sesiones…</p>}
        {!detailId && !loading && !catalogError && !items.length && <div className={styles.empty}><h3>El archivo está por sonar.</h3><p>Las próximas sesiones aparecerán aquí.</p></div>}
        <div className={detailId ? styles.detailGrid : styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cover}><Image src={item.coverUrl} alt={item.coverAlt} width={600} height={600} unoptimized loading="lazy" sizes="(max-width: 700px) 100vw, 33vw" /></div>
              <p className={styles.caption}>SET {String(item.id).padStart(2, "0")} · {item.artist}</p>
              <h3>{!detailId && staticIds.has(item.id) ? <Link href={`/sets/${item.id}/`} prefetch={false}>{item.title}</Link> : item.title}</h3>
              <p className={styles.caption}>{item.sessionDate && <time dateTime={item.sessionDate}>{formatSetDate(item.sessionDate)}</time>}{item.sessionDate && item.genre ? " · " : ""}{item.genre}</p>
              <p className={styles.sessionDescription}>{item.description}</p>
              <button type="button" aria-label={`${active?.id === item.id && playing ? "Pausar" : "Escuchar"} ${item.title}`} aria-pressed={active?.id === item.id && playing} onClick={() => choose(item)}>{active?.id === item.id && playing ? "Ⅱ Pausar" : "▶ Escuchar sesión"}</button>
              <details className={styles.credits}><summary>Créditos y formato</summary><p>{item.credits}</p><p>Portada: {item.coverCredit}</p><p>Audio original · {item.audioMimeType.replace("audio/", "").toUpperCase()}</p></details>
            </article>
          ))}
        </div>
        {catalogError && <div className={styles.notice} role="alert"><p>{catalogError}</p><button type="button" disabled={loading} onClick={() => requestPage(items.length ? nextCursor : null)}>Volver a intentar</button></div>}
        {nextCursor !== null && !catalogError && <button type="button" className={styles.more} disabled={loading} onClick={() => requestPage(nextCursor)}>{loading ? "Cargando…" : "Más sesiones"}</button>}
      </section>
      {!detailId && archive.length > 12 && <nav className={styles.archive} aria-label="Archivo completo de sesiones">
        <h2>Archivo completo</h2><ul>{archive.map((item) => <li key={item.id}><Link href={`/sets/${item.id}/`} prefetch={false}>{item.title} · {item.artist}</Link></li>)}</ul>
      </nav>}
      <noscript>Estás viendo la edición publicada. Activa JavaScript para utilizar el reproductor y consultar las últimas actualizaciones.</noscript>
    </div>
  );
}
