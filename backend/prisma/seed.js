const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

if (!process.env.DATABASE_URL && process.env.MONGODB_URI) {
  process.env.DATABASE_URL = process.env.MONGODB_URI;
}

const prisma = new PrismaClient();

const categories = [
  {
    category: "OUTILLAGE_ELECTRIQUE",
    names: ["Perceuse à percussion", "Meuleuse angulaire", "Scie sauteuse", "Ponceuse orbitale", "Marteau perforateur"],
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "OUTILLAGE_SANS_FIL",
    names: ["Visseuse sans fil", "Clé à choc sans fil", "Scie circulaire sans fil", "Pack batterie lithium", "Lampe de chantier rechargeable"],
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "OUTILLAGE_A_MAIN",
    names: ["Jeu de tournevis", "Marteau menuisier", "Pince multiprise", "Clé mixte", "Niveau à bulle"],
    imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "PIECE_ACCESSOIRES",
    names: ["Coffret forets métal", "Disques de coupe", "Embouts de vissage", "Lames de scie", "Mandrin rapide"],
    imageUrl: "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "QUINCAILLERIE_CONSOMMABLES",
    names: ["Boîte de vis", "Chevilles nylon", "Ruban adhésif chantier", "Colliers de serrage", "Gants de protection"],
    imageUrl: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "ELECTRICITE_LUMIERE",
    names: ["Projecteur LED", "Multiprise chantier", "Câble électrique", "Disjoncteur modulaire", "Spot encastrable"],
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "PLOMBERIE",
    names: ["Clé à tube", "Coupe-tube", "Flexible sanitaire", "Raccord laiton", "Ruban téflon"],
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
  },
];

function makeProduct(index) {
  const group = categories[index % categories.length];
  const baseName = group.names[Math.floor(index / categories.length) % group.names.length];
  const productNumber = index + 1;

  return {
    reference: `SEED-${String(productNumber).padStart(3, "0")}`,
    name: `${baseName} Pro ${productNumber}`,
    description: `Produit de démonstration pour le catalogue: ${baseName.toLowerCase()}, idéal pour les travaux professionnels et domestiques.`,
    category: group.category,
    price: 900 + productNumber * 275,
    imageUrl: group.imageUrl,
    isAvailable: productNumber % 9 !== 0,
    isNouvellite: productNumber % 6 === 0,
    isPromotion: productNumber % 7 === 0,
  };
}

async function main() {
  const products = Array.from({ length: 50 }, (_, index) => makeProduct(index));

  for (const product of products) {
    const { reference, ...productUpdate } = product;

    await prisma.product.upsert({
      where: { reference },
      update: productUpdate,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} fake products.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed fake products:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
