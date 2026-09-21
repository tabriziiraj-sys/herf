import { db } from './db';
import { categories } from './schema';
import { eq, like } from 'drizzle-orm';

export const categoryService = {
  async getAll() {
    return await db.select().from(categories).all();
  },

  async getById(id: number) {
    return await db.select().from(categories).where(eq(categories.id, id)).get();
  },

  async create(data: { name: string; description?: string }) {
    const result = await db.insert(categories).values(data).returning().get();
    return result;
  },

  async update(id: number, data: { name?: string; description?: string }) {
    const result = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(categories.id, id))
      .returning()
      .get();
    return result;
  },

  async delete(id: number) {
    await db.delete(categories).where(eq(categories.id, id));
  },

  async search(term: string) {
    return await db
      .select()
      .from(categories)
      .where(like(categories.name, `%${term}%`))
      .all();
  },
};
