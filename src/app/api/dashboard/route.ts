import { NextResponse } from 'next/server';
import { dashboardService } from '@/db/dashboard-service';

export async function GET() {
  try {
    const stats = await dashboardService.getStats();
    const recentMovements = await dashboardService.getRecentMovements(5);
    const lowStockProducts = await dashboardService.getLowStockProducts();
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentMovements,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
