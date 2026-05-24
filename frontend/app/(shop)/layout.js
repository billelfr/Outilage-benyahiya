import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pb-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
