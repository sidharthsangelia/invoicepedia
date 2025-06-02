import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Invoicepedia - AI Powered",
  description:
    "Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow.",
  openGraph: {
    url: "https://invoicepedia-lac.vercel.app/",
    type: "website",
    title: "Invoicepedia - AI Powered",
    description:
      "Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow.",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/87d73c74-dbda-4c00-bb08-0181fa8e6f5c.png?token=JE_M2UgTEsKK5DxDKZbfohxo-qBcunQmAzodZXZco0A&height=568&width=1200&expires=33284876157",
        width: 1200,
        height: 568,
        alt: "Invoicepedia - AI Powered",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitterhandle", // optional
    title: "Invoicepedia - AI Powered",
    description:
      "Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow.",
    images: [
      "https://opengraph.b-cdn.net/production/images/87d73c74-dbda-4c00-bb08-0181fa8e6f5c.png?token=JE_M2UgTEsKK5DxDKZbfohxo-qBcunQmAzodZXZco0A&height=568&width=1200&expires=33284876157",
    ],
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
          <head>
          <title>Invoicepedia - AI Powered</title>
          <meta
            name="description"
            content="Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow"
          />

          {/* Facebook / Open Graph */}
          <meta property="og:url" content="https://invoicepedia-lac.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Invoicepedia - AI Powered" />
          <meta
            property="og:description"
            content="Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow"
          />
          <meta
            property="og:image"
            content="https://opengraph.b-cdn.net/production/images/87d73c74-dbda-4c00-bb08-0181fa8e6f5c.png?token=JE_M2UgTEsKK5DxDKZbfohxo-qBcunQmAzodZXZco0A&height=568&width=1200&expires=33284876157"
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="invoicepedia-lac.vercel.app" />
          <meta property="twitter:url" content="https://invoicepedia-lac.vercel.app/" />
          <meta name="twitter:title" content="Invoicepedia - AI Powered" />
          <meta
            name="twitter:description"
            content="Invoicepedia is an AI-powered invoicing app designed to simplify and automate your billing process. Create, manage, and send professional invoices effortlessly with smart features that save you time and improve cash flow"
          />
          <meta
            name="twitter:image"
            content="https://opengraph.b-cdn.net/production/images/87d73c74-dbda-4c00-bb08-0181fa8e6f5c.png?token=JE_M2UgTEsKK5DxDKZbfohxo-qBcunQmAzodZXZco0A&height=568&width=1200&expires=33284876157"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen grid grid-rows-[auto_1fr_auto]`}
        >
          {" "}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Analytics />

            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
