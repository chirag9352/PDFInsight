import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

//google font
const outfit = Outfit({subsets: ["latin"],})

export const metadata = {
  title: "Ai PDF note taker",
  description: "Created using Next.JS",
};

export default function RootLayout({ children }) {
  return (
    // clerk provider
    <ClerkProvider>   
      <html lang="en">
        <body className={outfit.className}>
          {/* convex provider */}
          <Provider>{children}</Provider>   
        </body>
      </html>
    </ClerkProvider>
  );
}
