import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { getProfile } from "@/lib/data";
import { env } from "@/lib/env";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.fullName || "Portfolio";
  const title = profile?.siteTitle || `${name} — ${profile?.headline || "Portfolio"}`;
  const description =
    profile?.siteDescription ||
    profile?.shortIntro ||
    "A living record of projects, experience and learning.";

  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: `%s — ${name}` },
    description,
    keywords: profile?.siteKeywords?.length ? profile.siteKeywords : undefined,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: name,
      title,
      description,
      url: env.siteUrl,
      images: profile?.ogImage?.url ? [{ url: profile.ogImage.url, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: profile?.twitterHandle || undefined,
      images: profile?.ogImage?.url ? [profile.ogImage.url] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0C0E11" },
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
  ],
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `
(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
