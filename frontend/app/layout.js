import { Manrope } from "next/font/google";
import "./globals.css";
import { RootProviders } from "@/components/providers/root-providers";
import { BRAND_NAME } from "@/components/ui/Logo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: BRAND_NAME,
  description: "Premium e-commerce storefront and admin dashboard.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-white">
        <RootProviders>
          <div className="w-full overflow-x-hidden">
            {children}
          </div>
        </RootProviders>
      </body>
    </html>
  );
}
