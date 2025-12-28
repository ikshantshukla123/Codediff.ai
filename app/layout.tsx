import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ClerkProvider, 
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeDiff AI",
  description: "Enterprise Security Auditor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#3b82f6' }
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-[#0a0a0a] text-gray-100`}>
          
          {/* 👇 GLOBAL HEADER START */}
          <Navbar />
          {/* 👆 GLOBAL HEADER END */}

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}