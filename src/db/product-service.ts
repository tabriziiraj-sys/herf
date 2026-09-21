import { db } from './db';
import { products, stockMovements } from './schema';
import { eq, like } from 'drizzle-orm';

export const productService = {
  async getAll() {
    return await db.select().from(products).all();
  },

  async getById(id: number) {
    return await db.select().from(products).where(eq(products.id, id)).get();
  },

  async create(data: {
    name: string;
    sku: string;
    categoryId?: number | null;
    description?: string | null;
    unit?: string;
    minStock?: number;
  }) {
    const result = await db.insert(products).values(data).returning().get();
    return result;
  },

  async update(
    id: number,
    data: {
      name?: string;
      sku?: string;
      categoryId?: number | null;
      description?: string | null;
      unit?: string;
      minStock?: number;
    }
  ) {
    const result = await db
      .update(products)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id))
      .returning()
      .get();
    return result;
  },

  async delete(id: number) {
    await db.delete(products).where(eq(products.id, id));
  },

  async search(term: string) {
    return await db
      .select()
      .from(products)
      .where(like(products.name, `%${term}%`))
      .all();
  },

  async getByCategory(categoryId: number) {
    return await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .all();
  },
};
