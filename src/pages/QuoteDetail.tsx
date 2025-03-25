
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getQuoteById } from '@/data/mockQuotes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteItemList } from '@/components/quotes/QuoteItemList';
import { QuoteSummary } from '@/components/quotes/QuoteSummary';
import { QuoteStatusBadge } from '@/components/quotes/QuoteStatusBadge';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  Download, 
  Mail, 
  Send, 
  User, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const quote = getQuoteById(id || '');
  
  if (!quote) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Quote not found</h2>
          <p className="text-muted-foreground mt-2">The quote you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button className="mt-6" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }
  
  const isCustomer = currentUser?.role === 'customer';
  const canAccept = isCustomer && ['sent', 'viewed'].includes(quote.status);
  const canSend = currentUser?.role === 'sales' && ['draft'].includes(quote.status);
  
  const handleSendQuote = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Quote ${quote.id} has been sent to ${quote.customerName}`);
      setIsSending(false);
    }, 1000);
  };
  
  const handleAcceptQuote = () => {
    setIsAccepting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Quote accepted! We'll get started right away.");
      setIsAccepting(false);
    }, 1000);
  };
  
  const handleRejectQuote = () => {
    setIsRejecting(true);
    // Simulate API call
    setTimeout(() => {
      toast.info("Quote rejected. Thank you for your consideration.");
      setIsRejecting(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/quotes')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Quote {quote.id}
            <QuoteStatusBadge status={quote.status} />
          </h1>
          <p className="text-muted-foreground">
            Created on {format(new Date(quote.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
              <CardDescription>Service and product details</CardDescription>
            </CardHeader>
            <CardContent>
              <QuoteItemList items={quote.items} />
            </CardContent>
          </Card>
          
          {quote.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{quote.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Customer</p>
                    <p className="text-base">{quote.customerName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-base">{quote.customerEmail}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Valid Until</p>
                    <p className="text-base">{format(new Date(quote.validUntil), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <QuoteSummary quote={quote} />
          
          <div className="flex flex-col gap-3">
            {canAccept && (
              <>
                <Button onClick={handleAcceptQuote} disabled={isAccepting}>
                  <Check className="mr-2 h-4 w-4" />
                  {isAccepting ? 'Accepting...' : 'Accept Quote'}
                </Button>
                <Button variant="outline" onClick={handleRejectQuote} disabled={isRejecting}>
                  <X className="mr-2 h-4 w-4" />
                  {isRejecting ? 'Rejecting...' : 'Decline Quote'}
                </Button>
              </>
            )}
            
            {canSend && (
              <Button onClick={handleSendQuote} disabled={isSending}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? 'Sending...' : 'Send to Customer'}
              </Button>
            )}
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
