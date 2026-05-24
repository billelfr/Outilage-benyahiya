require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

let faker = null;

try {
  ({ faker } = require("@faker-js/faker"));
} catch (error) {
  faker = null;
}

if (faker) {
  faker.seed(20260504);
}

const productCatalog = [
  {
    name: "18V Brushless Hammer Drill Kit",
    description: "Compact cordless hammer drill for anchor holes, framing fixes, and day-to-day site work.",
    priceRange: [149, 189]
  },
  {
    name: "20V Impact Driver Set",
    description: "Fast-driving impact driver with two batteries for deck screws, lag bolts, and metal fasteners.",
    priceRange: [129, 169]
  },
  {
    name: "1/2 in. Corded Mixing Drill",
    description: "High-torque drill built for tile adhesive, mortar, paint, and plaster mixing.",
    priceRange: [109, 149]
  },
  {
    name: "Right-Angle Drill for Tight Bays",
    description: "Low-profile drill for joist cavities, cabinet installs, and service access in narrow spaces.",
    priceRange: [159, 219]
  },
  {
    name: "Rotary Hammer SDS-Plus 26mm",
    description: "Reliable rotary hammer for concrete anchors, cable runs, and medium-duty demolition.",
    priceRange: [179, 249]
  },
  {
    name: "4-1/2 in. Angle Grinder",
    description: "Versatile grinder for cutting rebar, dressing welds, and smoothing masonry edges.",
    priceRange: [69, 109]
  },
  {
    name: "5 in. Variable-Speed Grinder",
    description: "Controlled-speed grinder suited for stainless finishing, tile trimming, and precise surface prep.",
    priceRange: [119, 169]
  },
  {
    name: "7 in. Heavy-Duty Grinder",
    description: "Large-body grinder for deep cuts in steel pipe, concrete channels, and thick plate stock.",
    priceRange: [169, 229]
  },
  {
    name: "Brushless Die Grinder",
    description: "Compact die grinder for deburring, weld cleanup, and fabrication touch-up work.",
    priceRange: [139, 199]
  },
  {
    name: "Dust-Control Concrete Grinder",
    description: "Shroud-ready concrete grinder for smoothing patch repairs and coating removal indoors.",
    priceRange: [249, 329]
  },
  {
    name: "16 oz. Rip Claw Framing Hammer",
    description: "Balanced steel hammer for framing, formwork, and punch-list carpentry.",
    priceRange: [29, 45]
  },
  {
    name: "22 oz. Milled Face Hammer",
    description: "Milled striking face helps with grip on framing nails and repetitive overhead work.",
    priceRange: [39, 59]
  },
  {
    name: "3 lb. Drilling Hammer",
    description: "Short-handle drilling hammer for masonry chisels, stakes, and demolition detail work.",
    priceRange: [34, 54]
  },
  {
    name: "Anti-Vibe Club Hammer",
    description: "Shock-reducing handle makes it easier to break block, tap wedges, and set pins.",
    priceRange: [32, 49]
  },
  {
    name: "Fiberglass Sledge Hammer 10 lb.",
    description: "Heavy striking tool for concrete breakup, stubborn posts, and hardscape adjustment.",
    priceRange: [74, 99]
  },
  {
    name: "7-1/4 in. Circular Saw",
    description: "Jobsite circular saw for framing lumber, plywood breakdown, and fast repeat cuts.",
    priceRange: [129, 189]
  },
  {
    name: "Compact Reciprocating Saw",
    description: "One-handed recip saw for demolition, pipe cuts, and pruning in awkward positions.",
    priceRange: [119, 179]
  },
  {
    name: "Sliding Compound Miter Saw 10 in.",
    description: "Accurate crosscuts and bevels for trim, decking, and general carpentry.",
    priceRange: [279, 369]
  },
  {
    name: "Jigsaw with Orbital Action",
    description: "Clean curve-cutting saw for countertops, sheet goods, and finish carpentry details.",
    priceRange: [99, 149]
  },
  {
    name: "Cordless Band Saw Deep Cut",
    description: "Portable band saw for threaded rod, strut channel, and clean metal cutting on site.",
    priceRange: [229, 299]
  },
  {
    name: "Laser Distance Meter 50m",
    description: "Pocket laser measure for room layouts, ceiling estimates, and quick quoting on site.",
    priceRange: [49, 79]
  },
  {
    name: "24 in. Box Level",
    description: "Durable aluminum level for cabinet setting, tile lines, and framing checks.",
    priceRange: [35, 58]
  },
  {
    name: "Self-Leveling Cross Line Laser",
    description: "Bright line laser for drywall tracks, shelving installs, and tile alignment.",
    priceRange: [119, 179]
  },
  {
    name: "100 ft. Chalk Reel Set",
    description: "Fast snap-line kit for slab layout, wall lines, and roofing reference marks.",
    priceRange: [18, 34]
  },
  {
    name: "Digital Moisture Meter",
    description: "Useful for checking timber, drywall, and subfloor moisture before finishing work starts.",
    priceRange: [39, 69]
  },
  {
    name: "1-3/4 in. SDS-Max Demolition Hammer",
    description: "Breaker for trenching small runs, chipping tile beds, and removing damaged concrete.",
    priceRange: [449, 599]
  },
  {
    name: "Plate Compactor 6.5 HP",
    description: "Reliable compactor for paver bases, patch prep, and landscaping subgrade work.",
    priceRange: [699, 899]
  },
  {
    name: "Wet Tile Saw 7 in.",
    description: "Water-cooled tile saw for porcelain, ceramic, and neat edge finishing.",
    priceRange: [189, 259]
  },
  {
    name: "Concrete Core Drill Stand Kit",
    description: "Core drilling setup for HVAC penetrations, plumbing sleeves, and clean slab openings.",
    priceRange: [899, 1199]
  },
  {
    name: "Drywall Screw Gun Collated",
    description: "High-speed screw gun built for board hanging, metal studs, and repetitive fastening.",
    priceRange: [149, 219]
  }
];

const sampleOrders = [
  {
    customerName: "Karim Benali",
    customerPhone: "+213550000101",
    customerAddress: "14 Rue des Entrepreneurs, Alger",
    status: "CONFIRMED",
    items: [
      { productName: "18V Brushless Hammer Drill Kit", quantity: 1 },
      { productName: "24 in. Box Level", quantity: 1 },
      { productName: "100 ft. Chalk Reel Set", quantity: 2 }
    ]
  },
  {
    customerName: "Nadia Construction SARL",
    customerPhone: "+213550000202",
    customerAddress: "Zone Artisanale Lot 8, Oran",
    status: "PROCESSING",
    items: [
      { productName: "Dust-Control Concrete Grinder", quantity: 1 },
      { productName: "Rotary Hammer SDS-Plus 26mm", quantity: 2 },
      { productName: "Plate Compactor 6.5 HP", quantity: 1 }
    ]
  }
];

const sampleWishlistSessions = [
  {
    sessionId: "frontend-demo-session-1",
    productNames: [
      "7-1/4 in. Circular Saw",
      "Self-Leveling Cross Line Laser",
      "Drywall Screw Gun Collated"
    ]
  },
  {
    sessionId: "frontend-demo-session-2",
    productNames: [
      "5 in. Variable-Speed Grinder",
      "Wet Tile Saw 7 in."
    ]
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toDecimalString(value) {
  return Number(value).toFixed(2);
}

function getDeterministicPrice([min, max], index) {
  const spread = max - min;
  const modifier = ((index * 17) % 11) / 10;
  const price = min + spread * (0.35 + modifier / 2);
  return toDecimalString(Math.min(price, max));
}

function getDeterministicStock(index) {
  return ((index * 9 + 7) % 50) + 1;
}

function getCustomerName(fallbackName) {
  return faker ? faker.person.fullName() : fallbackName;
}

function getCustomerPhone(fallbackPhone) {
  if (!faker) {
    return fallbackPhone;
  }

  const rawNumber = faker.phone.number("550#######");
  return `+213${rawNumber}`;
}

function productPriceToNumber(price) {
  return Number(price);
}

async function seedAdmin() {
  const passwordHash = await bcrypt.hash("hashedpassword", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@test.com" },
    update: {
      name: "Admin",
      passwordHash
    },
    create: {
      name: "Admin",
      email: "admin@test.com",
      passwordHash
    }
  });

  console.log(`Admin ready: ${admin.email}`);
}

async function seedProducts() {
  const products = [];

  for (const [index, item] of productCatalog.entries()) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: item.name }
    });

    const data = {
      name: item.name,
      description: item.description,
      price: Number(getDeterministicPrice(item.priceRange, index)),
      imageUrl: `https://picsum.photos/seed/${slugify(item.name)}/1200/900`,
      stock: getDeterministicStock(index)
    };

    const product = existingProduct
      ? await prisma.product.update({
          where: { id: existingProduct.id },
          data
        })
      : await prisma.product.create({ data });

    products.push(product);
  }

  console.log(`Products ready: ${products.length}`);
  return products;
}

async function seedOrders(productMap) {
  for (const [index, orderSeed] of sampleOrders.entries()) {
    const customerName =
      index === 0 ? orderSeed.customerName : getCustomerName(orderSeed.customerName);
    const customerPhone =
      index === 0 ? orderSeed.customerPhone : getCustomerPhone(orderSeed.customerPhone);

    const items = orderSeed.items.map((item) => {
      const product = productMap.get(item.productName);

      if (!product) {
        throw new Error(`Missing seeded product: ${item.productName}`);
      }

      return {
        productId: product.id,
        quantity: item.quantity,
        price: productPriceToNumber(product.price)
      };
    });

    const totalPrice = Number(toDecimalString(
      items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    ));

    const existingOrder = await prisma.order.findFirst({
      where: {
        customerName,
        customerPhone
      }
    });

    if (existingOrder) {
      await prisma.orderItem.deleteMany({
        where: { orderId: existingOrder.id }
      });

      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          customerName,
          customerPhone,
          customerAddress: orderSeed.customerAddress,
          status: orderSeed.status,
          totalPrice,
          orderItems: {
            create: items
          }
        }
      });

      continue;
    }

    await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress: orderSeed.customerAddress,
        status: orderSeed.status,
        totalPrice,
        orderItems: {
          create: items
        }
      }
    });
  }

  console.log(`Orders ready: ${sampleOrders.length}`);
}

async function seedWishlists(productMap) {
  for (const session of sampleWishlistSessions) {
    for (const productName of session.productNames) {
      const product = productMap.get(productName);

      if (!product) {
        throw new Error(`Missing wishlist product: ${productName}`);
      }

      await prisma.wishlistItem.upsert({
        where: {
          sessionId_productId: {
            sessionId: session.sessionId,
            productId: product.id
          }
        },
        update: {},
        create: {
          sessionId: session.sessionId,
          productId: product.id
        }
      });
    }
  }

  console.log(`Wishlist items ready: ${sampleWishlistSessions.length} sessions`);
}

async function main() {
  await seedAdmin();

  const products = await seedProducts();
  const productMap = new Map(products.map((product) => [product.name, product]));

  await seedOrders(productMap);
  await seedWishlists(productMap);
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
