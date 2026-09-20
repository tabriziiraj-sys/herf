import { db } from './db';
import { categories, products, stockMovements } from './schema';
import { sql } from 'drizzle-orm';

export const dashboardService = {
  async getStats() {
    // Total categories
    const totalCategories = await db.select({ count: sql<number>`count(*)` }).from(categories).get();
    
    // Total products
    const totalProducts = await db.select({ count: sql<number>`count(*)` }).from(products).get();
    
    // Total movements
    const totalMovements = await db.select({ count: sql<number>`count(*)` }).from(stockMovements).get();
    
    // Low stock products (need to calculate from movements)
    const inventoryService = (await import('./inventory-service')).inventoryService;
    const allProducts = await db.select().from(products).all();
    const stockMap = await inventoryService.getAllProductsStock();
    
    let lowStockCount = 0;
    for (const product of allProducts) {
      const currentStock = stockMap.get(product.id) || 0;
      if (currentStock <= (product.minStock || 0)) {
        lowStockCount++;
      }
    }
    
    return {
      totalCategories: Number(totalCategories?.count) || 0,
      totalProducts: Number(totalProducts?.count) || 0,
      totalMovements: Number(totalMovements?.count) || 0,
      lowStockProducts: lowStockCount,
    };
  },

  async getRecentMovements(limit: number = 5) {
    const movementService = (await import('./stock-movement-service')).stockMovementService;
    return await movementService.getRecent(limit);
  },

  async getLowStockProducts() {
    const inventoryService = (await import('./inventory-service')).inventoryService;
    const allProducts = await db.select().from(products).all();
    const stockMap = await inventoryService.getAllProductsStock();
    
    const lowStockProducts = allProducts
      .map(product => ({
        ...product,
        currentStock: stockMap.get(product.id) || 0,
      }))
      .filter(p => p.currentStock <= (p.minStock || 0));
    
    return lowStockProducts;
  },
};
