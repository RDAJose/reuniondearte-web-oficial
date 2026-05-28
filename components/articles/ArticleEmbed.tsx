import { ArticleLinkCard } from "@/components/articles/ArticleLinkCard";

type ArticleEmbedProps = {
  url: string;
};

type EmbedDefinition = {
  aspectRatio?: string;
  provider: string;
  src: string;
  title: string;
};

const SPOTIFY_TYPES = new Set([
  "album",
  "artist",
  "episode",
  "playlist",
  "show",
  "track",
]);

function parseHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function getYouTubeEmbed(url: URL): EmbedDefinition | null {
  const host = url.hostname.replace(/^www\./, "");
  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else {
      const [section, id] = url.pathname.split("/").filter(Boolean);
      if (section === "shorts" || section === "embed") {
        videoId = id ?? null;
      }
    }
  }

  if (!videoId || !/^[A-Za-z0-9_-]{6,}$/.test(videoId)) {
    return null;
  }

  return {
    provider: "YouTube",
    src: `https://www.youtube-nocookie.com/embed/${videoId}`,
    title: "Video de YouTube",
  };
}

function getVimeoEmbed(url: URL): EmbedDefinition | null {
  const host = url.hostname.replace(/^www\./, "");
  const pathParts = url.pathname.split("/").filter(Boolean);
  const videoId =
    host === "player.vimeo.com" && pathParts[0] === "video"
      ? pathParts[1]
      : pathParts[0];

  if (host !== "vimeo.com" && host !== "player.vimeo.com") {
    return null;
  }

  if (!videoId || !/^\d+$/.test(videoId)) {
    return null;
  }

  return {
    provider: "Vimeo",
    src: `https://player.vimeo.com/video/${videoId}`,
    title: "Video de Vimeo",
  };
}

function getSpotifyEmbed(url: URL): EmbedDefinition | null {
  const host = url.hostname.replace(/^www\./, "");
  const [type, id] = url.pathname.split("/").filter(Boolean);

  if (host !== "open.spotify.com" || !SPOTIFY_TYPES.has(type) || !id) {
    return null;
  }

  return {
    aspectRatio: "normal",
    provider: "Spotify",
    src: `https://open.spotify.com/embed/${type}/${id}`,
    title: "Contenido de Spotify",
  };
}

function getSoundCloudEmbed(url: URL): EmbedDefinition | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host !== "soundcloud.com") {
    return null;
  }

  const cleanUrl = `${url.origin}${url.pathname}`;
  const params = new URLSearchParams({
    auto_play: "false",
    color: "#8b2418",
    hide_related: "false",
    show_comments: "false",
    show_reposts: "false",
    show_user: "true",
    url: cleanUrl,
    visual: "false",
  });

  return {
    aspectRatio: "audio",
    provider: "SoundCloud",
    src: `https://w.soundcloud.com/player/?${params.toString()}`,
    title: "Contenido de SoundCloud",
  };
}

export function getArticleEmbed(urlValue: string): EmbedDefinition | null {
  const url = parseHttpUrl(urlValue);

  if (!url) {
    return null;
  }

  return (
    getYouTubeEmbed(url) ??
    getVimeoEmbed(url) ??
    getSpotifyEmbed(url) ??
    getSoundCloudEmbed(url)
  );
}

export function ArticleEmbed({ url }: ArticleEmbedProps) {
  const embed = getArticleEmbed(url);

  if (!embed) {
    return <ArticleLinkCard url={url} />;
  }

  return (
    <div className="article-embed" data-aspect={embed.aspectRatio ?? "video"}>
      <iframe
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={embed.src}
        title={embed.title}
      />
      <span>{embed.provider}</span>
    </div>
  );
}
