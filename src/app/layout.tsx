import type { Metadata } from "next";
import { Roboto_Condensed, Oswald, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ThemeTransition } from "@/components/shared/ThemeTransition";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "North : Learn The right way",
  description: "Transform learning into skill mastery with AI-driven skill intelligence and structured progression.",
  icons: {
    icon: '/images/dark_themelogo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme-storage');
                  var root = document.documentElement;
                  root.style.setProperty('--disable-transitions', '1');
                  
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    if (parsed.state && parsed.state.theme === 'light') {
                      root.classList.add('light');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${robotoCondensed.variable} ${oswald.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ThemeTransition />
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
