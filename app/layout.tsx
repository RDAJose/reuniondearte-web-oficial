import type { Metadata } from "next";
import Script from "next/script";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-021Z217Z8C";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <AnalyticsConsent />
        <Script id="google-analytics-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
            window.gtag("consent", "default", {
              analytics_storage: "denied",
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied"
            });
            window.gtag("js", new Date());
            window.gtag("config", "${GA_MEASUREMENT_ID}", {
              send_page_view: false,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `}
        </Script>
        <Script
          id="google-analytics-gtag"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
