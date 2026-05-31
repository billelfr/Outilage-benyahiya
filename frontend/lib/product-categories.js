export const PRODUCT_CATEGORIES = [
  {
    value: "OUTILLAGE_ELECTRIQUE",
    label: "Outillage électrique",
    description: "Machines filaires et outils puissants pour chantier.",
    image: "/categories/Outillage électrique.jpeg",
  },
  {
    value: "OUTILLAGE_SANS_FIL",
    label: "Outillage sans fil",
    description: "Solutions mobiles avec batteries et chargeurs.",
    image: "/categories/Outillage sans fil .jpg",
  },
  {
    value: "OUTILLAGE_A_MAIN",
    label: "Outillage à main",
    description: "Essentiels précis pour chaque intervention.",
    image: "/categories/Outillage a main .jpeg",
  },
  {
    value: "PIECE_ACCESSOIRES",
    label: "Pièces & accessoires",
    description: "Embouts, consommables et compléments techniques.",
    image: "/categories/Piece & accessoires .jpg",
  },
  {
    value: "QUINCAILLERIE_CONSOMMABLES",
    label: "Quincaillerie & consommables",
    description: "Fixations, matériel et fournitures d'atelier.",
    image: "/categories/Quincaillerie &  consommables.jpg",
  },
  {
    value: "ELECTRICITE_LUMIERE",
    label: "Électricité & lumière",
    description: "Équipement électrique, éclairage et installation.",
    image: "/categories/Électricité & lumière.jpg",
  },
  {
    value: "PLOMBERIE",
    label: "Plomberie",
    description: "Outils et accessoires pour travaux de plomberie.",
    image: "/categories/Plomberie.jpeg",
  },
];

export function getProductCategory(value) {
  return PRODUCT_CATEGORIES.find((category) => category.value === value);
}
