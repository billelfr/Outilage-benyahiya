export const PRODUCT_CATEGORIES = [
  {
    value: "OUTILLAGE_ELECTRIQUE",
    label: "Outillage électrique",
    description: "Machines filaires et outils puissants pour chantier.",
    image: "/categories/outilage-electrique.png",
  },
  {
    value: "OUTILLAGE_SANS_FIL",
    label: "Outillage sans fil",
    description: "Solutions mobiles avec batteries et chargeurs.",
    image: "/categories/sans-fil.png",
  },
  {
    value: "OUTILLAGE_A_MAIN",
    label: "Outillage à main",
    description: "Essentiels précis pour chaque intervention.",
    image: "/categories/a-main.png",
  },
  {
    value: "PIECE_ACCESSOIRES",
    label: "Pièces & accessoires",
    description: "Embouts, consommables et compléments techniques.",
    image: "/categories/pieces-accessoires.png",
  },
  {
    value: "QUINCAILLERIE_CONSOMMABLES",
    label: "Quincaillerie & consommables",
    description: "Fixations, matériel et fournitures d'atelier.",
    image: "/categories/quancaillerie-consommables.png",
  },
  {
    value: "ELECTRICITE_LUMIERE",
    label: "Électricité & lumière",
    description: "Équipement électrique, éclairage et installation.",
    image: "/categories/elec-lumiere.png",
  },
  {
    value: "PLOMBERIE",
    label: "Plomberie",
    description: "Outils et accessoires pour travaux de plomberie.",
    image: "/categories/plomberie.png",
  },
  {
    value: "PROMOTION",
    label: "Promotion",
    description: "Offres et prix réduits du moment.",
    image: "/categories/promotion.png",
  },
  {
    value: "NOUVEAUTE",
    label: "Nouveauté",
    description: "Derniers produits ajoutés au catalogue.",
    image: "/categories/nouveautes.png",
  },
];

export function getProductCategory(value) {
  return PRODUCT_CATEGORIES.find((category) => category.value === value);
}

export function productMatchesCategory(product, categoryValue) {
  if (categoryValue === "PROMOTION") {
    return product.isPromotion;
  }

  if (categoryValue === "NOUVEAUTE") {
    return product.isNouvellite;
  }

  return product.category === categoryValue;
}
