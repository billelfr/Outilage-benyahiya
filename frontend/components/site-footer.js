import { BRAND_NAME, Logo } from "@/components/ui/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white/70 py-10">
      <div className="page-shell grid gap-8 text-sm text-muted md:grid-cols-[1.2fr_1fr_1fr] md:items-start">
        <div className="space-y-3">
          <Logo className="h-16 w-16" />
          <div>
            <p className="text-base font-black text-foreground">{BRAND_NAME}</p>
            <p className="mt-1 leading-6">Professional tools, equipment, and construction supplies.</p>
          </div>
        </div>

        <address className="not-italic">
          <p className="font-black text-foreground">Contact</p>
          <div className="mt-3 space-y-2">
            <a className="block hover:text-foreground" href="tel:+213550000000">
              +213 550 000 000
            </a>
            <a className="block hover:text-foreground" href="mailto:contact@outillage-benyahia.com">
              contact@outillage-benyahia.com
            </a>
          </div>
        </address>

        <address className="not-italic">
          <p className="font-black text-foreground">Store Location</p>
          <p className="mt-3 leading-6">
            Outillage General Benyahiya
            <br />
            Alger, Algeria
          </p>
        </address>
      </div>
    </footer>
  );
}
