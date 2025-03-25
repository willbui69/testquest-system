
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockQuotes } from '@/data/mockQuotes';
import { ProductQuote, QuoteStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QuoteStatusBadge } from '@/components/quotes/QuoteStatusBadge';
import { format } from 'date-fns';
import { ArrowRight, Calendar, FileText, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Quotes() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter quotes based on user role and selected status filter
  const filteredQuotes = mockQuotes.filter((quote) => {
    // For customers, only show their quotes
    if (currentUser?.role === 'customer') {
      if (quote.customerId !== currentUser.id && quote.customerId !== 'customer-1') {
        return false;
      }
    }
    
    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      return quote.status === statusFilter;
    }
    
    return true;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Quotes</h1>
          <p className="text-muted-foreground">
            {currentUser?.role === 'sales' 
              ? 'Manage and create quotes for customers' 
              : 'View and accept product quotes'}
          </p>
        </div>
        
        {currentUser?.role === 'sales' && (
          <Button onClick={() => navigate('/quotes/new')}>
            <Plus className="mr-2 h-4 w-4" /> 
            Create Quote
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Quotes</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote #</TableHead>
                {currentUser?.role === 'sales' && <TableHead>Customer</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  {currentUser?.role === 'sales' && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{quote.customerName}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(quote.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </TableCell>
                  <TableCell>${quote.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <QuoteStatusBadge status={quote.status} />
                  </TableCell>
                  <TableCell>{format(new Date(quote.validUntil), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredQuotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={currentUser?.role === 'sales' ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    No quotes found with the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
