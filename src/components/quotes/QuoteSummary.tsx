
import React from 'react';
import { ProductQuote } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface QuoteSummaryProps {
  quote: ProductQuote;
}

export function QuoteSummary({ quote }: QuoteSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(quote.subtotal)}</span>
          </div>
          
          {quote.discountTotal && quote.discountTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span className="text-destructive">-{formatCurrency(quote.discountTotal)}</span>
            </div>
          )}
          
          {quote.tax && quote.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatCurrency(quote.tax)}</span>
            </div>
          )}
          
          <div className="border-t pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(quote.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
