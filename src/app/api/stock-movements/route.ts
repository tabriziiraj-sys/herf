import { NextRequest, NextResponse } from 'next/server';
import { stockMovementService } from '@/db/stock-movement-service';

export async function GET() {
  try {
    const movements = await stockMovementService.getAll();
    return NextResponse.json({ success: true, data: movements });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, type, quantity, referenceNumber, notes } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID, type, and quantity are required' },
        { status: 400 }
      );
    }

    if (!['in', 'out', 'adjustment'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid movement type' },
        { status: 400 }
      );
    }

    const movement = await stockMovementService.create({
      productId,
      type: type as 'in' | 'out' | 'adjustment',
      quantity,
      referenceNumber: referenceNumber || null,
      notes: notes || null,
    });
    return NextResponse.json({ success: true, data: movement }, { status: 201 });
  } catch (error) {
    console.error('Error creating stock movement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
