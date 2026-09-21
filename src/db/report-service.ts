import { db } from './db';
import { stockMovements, products, categories } from './schema';
import { sql, eq } from 'drizzle-orm';

export const reportService = {
  async getStockMovementReport(startDate?: string, endDate?: string) {
    let query = db
      .select({
        movement: stockMovements,
        product: products,
      })
      .from(stockMovements)
      .leftJoin(products, eq(stockMovements.productId, products.id));

    if (startDate && endDate) {
      query = query.where(
        sql`${stockMovements.createdAt} BETWEEN ${startDate} AND ${endDate}`
      );
    }

    return await query.all();
  },

  async getProductMovementSummary() {
    const allProducts = await db.select().from(products).all();
    const inventoryService = (await import('./inventory-service')).inventoryService;
    const stockMap = await inventoryService.getAllProductsStock();

    return allProducts.map(product => ({
      ...product,
      currentStock: stockMap.get(product.id) || 0,
    }));
  },

  async getCategorySummary() {
    const categories = await db.select().from(categories).all();
    const inventoryService = (await import('./inventory-service')).inventoryService;

    const summary = [];
    for (const category of categories) {
      const productsInCategory = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, category.id))
        .all();

      let totalStock = 0;
      for (const product of productsInCategory) {
        const stock = await inventoryService.getProductStock(product.id);
        totalStock += stock;
      }

      summary.push({
        ...category,
        productCount: productsInCategory.length,
        totalStock,
      });
    }

    return summary;
  },

  async getMonthlyMovements() {
    const movements = await db.select().from(stockMovements).all();
    
    const monthlyData: Record<string, { in: number; out: number; adjustment: number }> = {};
    
    for (const movement of movements) {
      const month = movement.createdAt.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { in: 0, out: 0, adjustment: 0 };
      }
      
      if (movement.type === 'in') {
        monthlyData[month].in += movement.quantity;
      } else if (movement.type === 'out') {
        monthlyData[month].out += movement.quantity;
      } else if (movement.type === 'adjustment') {
        monthlyData[month].adjustment += movement.quantity;
      }
    }
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
  },
};

