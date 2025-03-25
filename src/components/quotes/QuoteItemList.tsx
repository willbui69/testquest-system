
import React from 'react';
import { QuoteItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

interface QuoteItemListProps {
  items: QuoteItem[];
  editable?: boolean;
  onRemove?: (id: string) => void;
}

export function QuoteItemList({ items, editable = false, onRemove }: QuoteItemListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead className="text-right">Total</TableHead>
          {editable && <TableHead className="w-[80px]"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
            <TableCell>{item.discount ? `${item.discount}%` : '-'}</TableCell>
            <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
            {editable && (
              <TableCell>
                {onRemove && (
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Remove
                  </button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
