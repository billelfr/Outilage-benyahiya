import Image from "next/image";
import React from "react";

export const LOGO_SRC = "/logo.png";
export const BRAND_NAME = "Outillage General Benyahiya";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      aria-label={BRAND_NAME}
    >
      <Image
        src={LOGO_SRC}
        alt={BRAND_NAME}
        width={1440}
        height={1440}
        priority={priority}
        className="h-full w-full object-contain drop-shadow-[0_4px_7px_rgba(0,0,0,0.28)]"
      />
    </span>
  );
}
