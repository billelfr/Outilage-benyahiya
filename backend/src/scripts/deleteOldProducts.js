const prisma = require("../lib/prisma");

async function deleteOldProducts() {
  const idsToDelete = [
    "6a1232c59c23177b01ddca1a",
    "6a132dd74f7c8a464cc9140f"
  ];

  try {
    console.log("Attempting to delete old products with IDs:", idsToDelete);

    for (const id of idsToDelete) {
      try {
        const result = await prisma.product.delete({
          where: { reference: id }
        });
        console.log(`✅ Deleted product: ${id}`);
      } catch (error) {
        console.log(`⚠️  Could not delete ${id}: ${error.message}`);
      }
    }

    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldProducts();
