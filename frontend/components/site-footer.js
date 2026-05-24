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
            <a className="block hover:text-foreground" href="https://www.instagram.com/outillagebenyahia/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="block hover:text-foreground" href="https://www.tiktok.com/@billelforreal" target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          </div>
        </address>

        <address className="not-italic">
          <p className="font-black text-foreground">Store Location</p>
          <a
            className="mt-3 block leading-6 hover:text-foreground"
            href="https://www.google.com/maps/place/Outillage+benyahia/@36.5417803,3.0824655,17z/data=!4m6!3m5!1s0x128f01a6d3eff275:0xb074f99702174a55!8m2!3d36.5418041!4d3.0824499!16s%2Fg%2F11lkj64fr2!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUxNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Outillage General Benyahiya
            <br />
            Alger, Algeria
          </a>
        </address>
      </div>
    </footer>
  );
}
