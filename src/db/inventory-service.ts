import { db } from './db';
import { categories, products, stockMovements } from './schema';
import { eq } from 'drizzle-orm';

// Service for calculating inventory from stock movements
export const inventoryService = {
  // Calculate current stock for a product
  async getProductStock(productId: number): Promise<number> {
    const movements = await db.select().from(stockMovements).where(eq(stockMovements.productId, productId));
    
    let stock = 0;
    for (const movement of movements) {
      if (movement.type === 'in') {
        stock += movement.quantity;
      } else if (movement.type === 'out') {
        stock -= movement.quantity;
      } else if (movement.type === 'adjustment') {
        stock += movement.quantity; // adjustment can be positive or negative
      }
    }
    return stock;
  },

  // Calculate stock for all products
  async getAllProductsStock(): Promise<Map<number, number>> {
    const movements = await db.select().from(stockMovements);
    const stockMap = new Map<number, number>();
    
    for (const movement of movements) {
      const current = stockMap.get(movement.productId) || 0;
      if (movement.type === 'in') {
        stockMap.set(movement.productId, current + movement.quantity);
      } else if (movement.type === 'out') {
        stockMap.set(movement.productId, current - movement.quantity);
      } else if (movement.type === 'adjustment') {
        stockMap.set(movement.productId, current + movement.quantity);
      }
    }
    
    return stockMap;
  },

  // Get stock with product details
  async getInventoryWithDetails() {
    const allProducts = await db.select().from(products).all();
    const stockMap = await this.getAllProductsStock();
    
    return allProducts.map(product => ({
      ...product,
      currentStock: stockMap.get(product.id) || 0,
    }));
  },
};
