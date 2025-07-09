import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "./_trpc/provider";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/Functionalities/theme-provider";
import Script from "next/script";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevDash",
  description: "My personal AI assistant for GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <TRPCProvider>
            <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
              <Script src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
              />
              {children}
            </ThemeProvider>
            <Toaster />
          </TRPCProvider>
          
        </body>
      </html>
      </ClerkProvider>
  );
}
