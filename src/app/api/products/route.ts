import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/db/product-service';

export async function GET() {
  try {
    const products = await productService.getAll();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, categoryId, description, unit, minStock } = body;

    if (!name || !sku) {
      return NextResponse.json(
        { success: false, error: 'Name and SKU are required' },
        { status: 400 }
      );
    }

    const product = await productService.create({
      name,
      sku,
      categoryId: categoryId || null,
      description: description || null,
      unit: unit || 'عدد',
      minStock: minStock || 0,
    });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
