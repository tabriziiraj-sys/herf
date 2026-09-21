import { db } from './db';
import { stockMovements, products } from './schema';
import { eq, desc } from 'drizzle-orm';

export const stockMovementService = {
  async getAll() {
    return await db
      .select({
        movement: stockMovements,
        product: products,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt))
      .all();
  },

  async getById(id: number) {
    return await db
      .select({
        movement: stockMovements,
        product: products,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .where(eq(stockMovements.id, id))
      .get();
  },

  async create(data: {
    productId: number;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    referenceNumber?: string | null;
    notes?: string | null;
  }) {
    // Validate product exists
    const product = await db.select().from(products).where(eq(products.id, data.productId)).get();
    if (!product) {
      throw new Error('Product not found');
    }

    // For 'out' movements, check if there's enough stock
    if (data.type === 'out') {
      const inventoryService = (await import('./inventory-service')).inventoryService;
      const currentStock = await inventoryService.getProductStock(data.productId);
      if (currentStock < data.quantity) {
        throw new Error('Insufficient stock');
      }
    }

    const result = await db.insert(stockMovements).values(data).returning().get();
    return result;
  },

  async getByProductId(productId: number) {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId))
      .orderBy(desc(stockMovements.createdAt))
      .all();
  },

  async getRecent(limit: number = 10) {
    return await db
      .select({
        movement: stockMovements,
        product: products,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id))
      .orderBy(desc(stockMovements.createdAt))
      .limit(limit)
      .all();
  },
};
