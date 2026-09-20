import { db } from './db';
import { categories, products, stockMovements } from './schema';

export const seedData = async () => {
  console.log('Seeding database...');

  // Check if data already exists
  const existingCategories = await db.select().from(categories).all();
  if (existingCategories.length > 0) {
    console.log('Database already seeded.');
    return;
  }

  // Create categories
  const categoryData = [
    { name: 'الکترونیک', description: 'محصولات الکترونیکی' },
    { name: 'لوازم خانگی', description: 'لوازم خانگی و آشپزخانه' },
    { name: 'ابزارآلات', description: 'ابزارهای صنعتی و ساختمانی' },
    { name: 'مواد غذایی', description: 'مواد غذایی و خوراکی' },
    { name: 'لوازم تحریر', description: 'لوازم اداری و تحریر' },
  ];

  const createdCategories = [];
  for (const cat of categoryData) {
    const created = await db.insert(categories).values(cat).returning().get();
    createdCategories.push(created);
  }

  console.log(`Created ${createdCategories.length} categories`);

  // Create products
  const productData = [
    { name: 'گوشی موبایل', sku: 'ELEC-001', categoryId: createdCategories[0].id, unit: 'عدد', minStock: 5 },
    { name: 'لپ‌تاپ', sku: 'ELEC-002', categoryId: createdCategories[0].id, unit: 'عدد', minStock: 3 },
    { name: 'هدفون', sku: 'ELEC-003', categoryId: createdCategories[0].id, unit: 'عدد', minStock: 10 },
    { name: 'tablet', sku: 'ELEC-004', categoryId: createdCategories[0].id, unit: 'عدد', minStock: 5 },
    { name: 'شارژر', sku: 'ELEC-005', categoryId: createdCategories[0].id, unit: 'عدد', minStock: 20 },
    { name: 'یخچال', sku: 'HOME-001', categoryId: createdCategories[1].id, unit: 'عدد', minStock: 2 },
    { name: 'ماشین لباسشویی', sku: 'HOME-002', categoryId: createdCategories[1].id, unit: 'عدد', minStock: 2 },
    { name: 'مایکروویو', sku: 'HOME-003', categoryId: createdCategories[1].id, unit: 'عدد', minStock: 5 },
    { name: 'جاروبرقی', sku: 'HOME-004', categoryId: createdCategories[1].id, unit: 'عدد', minStock: 5 },
    { name: 'تلویزیون', sku: 'HOME-005', categoryId: createdCategories[1].id, unit: 'عدد', minStock: 3 },
    { name: 'دریل', sku: 'TOOL-001', categoryId: createdCategories[2].id, unit: 'عدد', minStock: 5 },
    { name: 'اره برقی', sku: 'TOOL-002', categoryId: createdCategories[2].id, unit: 'عدد', minStock: 3 },
    { name: 'پیچ‌گوشتی', sku: 'TOOL-003', categoryId: createdCategories[2].id, unit: 'عدد', minStock: 20 },
    { name: 'چکش', sku: 'TOOL-004', categoryId: createdCategories[2].id, unit: 'عدد', minStock: 15 },
    { name: 'متر', sku: 'TOOL-005', categoryId: createdCategories[2].id, unit: 'عدد', minStock: 10 },
    { name: 'برنج', sku: 'FOOD-001', categoryId: createdCategories[3].id, unit: 'کیلوگرم', minStock: 50 },
    { name: 'روغن', sku: 'FOOD-002', categoryId: createdCategories[3].id, unit: 'لیتر', minStock: 30 },
    { name: 'شکر', sku: 'FOOD-003', categoryId: createdCategories[3].id, unit: 'کیلوگرم', minStock: 40 },
    { name: 'ماکارونی', sku: 'FOOD-004', categoryId: createdCategories[3].id, unit: 'بسته', minStock: 100 },
    { name: 'دفتر', sku: 'STAT-001', categoryId: createdCategories[4].id, unit: 'عدد', minStock: 50 },
    { name: 'خودکار', sku: 'STAT-002', categoryId: createdCategories[4].id, unit: 'عدد', minStock: 100 },
  ];

  const createdProducts = [];
  for (const prod of productData) {
    const created = await db.insert(products).values(prod).returning().get();
    createdProducts.push(created);
  }

  console.log(`Created ${createdProducts.length} products`);

  // Create stock movements
  const movements = [
    // Stock In
    { productId: createdProducts[0].id, type: 'in' as const, quantity: 50, referenceNumber: 'IN-001', notes: 'ورود اولیه' },
    { productId: createdProducts[1].id, type: 'in' as const, quantity: 30, referenceNumber: 'IN-002', notes: 'ورود اولیه' },
    { productId: createdProducts[2].id, type: 'in' as const, quantity: 100, referenceNumber: 'IN-003', notes: 'ورود اولیه' },
    { productId: createdProducts[3].id, type: 'in' as const, quantity: 40, referenceNumber: 'IN-004', notes: 'ورود اولیه' },
    { productId: createdProducts[4].id, type: 'in' as const, quantity: 200, referenceNumber: 'IN-005', notes: 'ورود اولیه' },
    { productId: createdProducts[5].id, type: 'in' as const, quantity: 20, referenceNumber: 'IN-006', notes: 'ورود اولیه' },
    { productId: createdProducts[6].id, type: 'in' as const, quantity: 15, referenceNumber: 'IN-007', notes: 'ورود اولیه' },
    { productId: createdProducts[7].id, type: 'in' as const, quantity: 25, referenceNumber: 'IN-008', notes: 'ورود اولیه' },
    { productId: createdProducts[8].id, type: 'in' as const, quantity: 30, referenceNumber: 'IN-009', notes: 'ورود اولیه' },
    { productId: createdProducts[9].id, type: 'in' as const, quantity: 20, referenceNumber: 'IN-010', notes: 'ورود اولیه' },
    
    // More stock in for tools
    { productId: createdProducts[10].id, type: 'in' as const, quantity: 40, referenceNumber: 'IN-011', notes: 'ورود اولیه' },
    { productId: createdProducts[11].id, type: 'in' as const, quantity: 25, referenceNumber: 'IN-012', notes: 'ورود اولیه' },
    { productId: createdProducts[12].id, type: 'in' as const, quantity: 100, referenceNumber: 'IN-013', notes: 'ورود اولیه' },
    { productId: createdProducts[13].id, type: 'in' as const, quantity: 80, referenceNumber: 'IN-014', notes: 'ورود اولیه' },
    { productId: createdProducts[14].id, type: 'in' as const, quantity: 60, referenceNumber: 'IN-015', notes: 'ورود اولیه' },
    
    // Food items
    { productId: createdProducts[15].id, type: 'in' as const, quantity: 500, referenceNumber: 'IN-016', notes: 'ورود اولیه' },
    { productId: createdProducts[16].id, type: 'in' as const, quantity: 300, referenceNumber: 'IN-017', notes: 'ورود اولیه' },
    { productId: createdProducts[17].id, type: 'in' as const, quantity: 400, referenceNumber: 'IN-018', notes: 'ورود اولیه' },
    { productId: createdProducts[18].id, type: 'in' as const, quantity: 1000, referenceNumber: 'IN-019', notes: 'ورود اولیه' },
    
    // Stationery
    { productId: createdProducts[19].id, type: 'in' as const, quantity: 300, referenceNumber: 'IN-020', notes: 'ورود اولیه' },
    { productId: createdProducts[20].id, type: 'in' as const, quantity: 500, referenceNumber: 'IN-021', notes: 'ورود اولیه' },

    // Stock Out
    { productId: createdProducts[0].id, type: 'out' as const, quantity: 15, referenceNumber: 'OUT-001', notes: 'فروش' },
    { productId: createdProducts[1].id, type: 'out' as const, quantity: 8, referenceNumber: 'OUT-002', notes: 'فروش' },
    { productId: createdProducts[2].id, type: 'out' as const, quantity: 30, referenceNumber: 'OUT-003', notes: 'فروش' },
    { productId: createdProducts[5].id, type: 'out' as const, quantity: 5, referenceNumber: 'OUT-004', notes: 'فروش' },
    { productId: createdProducts[15].id, type: 'out' as const, quantity: 100, referenceNumber: 'OUT-005', notes: 'فروش' },
    { productId: createdProducts[19].id, type: 'out' as const, quantity: 50, referenceNumber: 'OUT-006', notes: 'فروش' },
    { productId: createdProducts[20].id, type: 'out' as const, quantity: 100, referenceNumber: 'OUT-007', notes: 'فروش' },

    // Adjustments
    { productId: createdProducts[3].id, type: 'adjustment' as const, quantity: -5, referenceNumber: 'ADJ-001', notes: 'ضایعات' },
    { productId: createdProducts[17].id, type: 'adjustment' as const, quantity: -20, referenceNumber: 'ADJ-002', notes: 'انبارگردانی' },
  ];

  for (const movement of movements) {
    await db.insert(stockMovements).values(movement);
  }

  console.log(`Created ${movements.length} stock movements`);
  console.log('Seeding completed!');
};
