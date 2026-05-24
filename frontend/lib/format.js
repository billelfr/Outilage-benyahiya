export function formatCurrency(value, currency = "DZD", locale = "fr-DZ") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

export function formatDate(value, locale = "en-US") {
  if (!value) {
    return "Recently";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

const CATEGORY_LABELS = {
  OUTILLAGE_ELECTRIQUE: "Outillage électrique",
  OUTILLAGE_SANS_FIL: "Outillage sans fil",
  OUTILLAGE_A_MAIN: "Outillage à main",
  PIECE_ACCESSOIRES: "Pièce & accessoires",
  QUINCAILLERIE_CONSOMMABLES: "Quincaillerie & consommables",
  ELECTRICITE_LUMIERE: "Électricité & lumière",
  PLOMBERIE: "Plomberie",
  NOUVEAUTE: "Nouveauté",
  PROMOTION: "Promotion",
};

export function formatCategory(category) {
  if (!category) {
    return "Produit";
  }
  return CATEGORY_LABELS[category] || category;
}
