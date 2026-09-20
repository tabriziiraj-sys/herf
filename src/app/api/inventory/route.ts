import { NextRequest, NextResponse } from 'next/server';
import { inventoryService } from '@/db/inventory-service';

export async function GET() {
  try {
    const inventory = await inventoryService.getInventoryWithDetails();
    return NextResponse.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
