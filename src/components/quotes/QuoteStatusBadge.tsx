
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { QuoteStatus } from '@/types';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-slate-200 text-slate-800 hover:bg-slate-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'viewed':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100';
      case 'accepted':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'rejected':
        return 'bg-rose-100 text-rose-800 hover:bg-rose-100';
      case 'expired':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return '';
    }
  };

  return (
    <Badge variant="outline" className={getStatusStyles()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
