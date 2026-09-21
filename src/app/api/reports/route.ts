import { NextRequest, NextResponse } from 'next/server';
import { reportService } from '@/db/report-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'summary';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let data;
    
    switch (type) {
      case 'movements':
        data = await reportService.getStockMovementReport(startDate || undefined, endDate || undefined);
        break;
      case 'products':
        data = await reportService.getProductMovementSummary();
        break;
      case 'categories':
        data = await reportService.getCategorySummary();
        break;
      case 'monthly':
        data = await reportService.getMonthlyMovements();
        break;
      default:
        data = await reportService.getProductMovementSummary();
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
