
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { QuoteItem, ProductQuote } from '@/types';
import { QuoteItemList } from '@/components/quotes/QuoteItemList';
import { QuoteSummary } from '@/components/quotes/QuoteSummary';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Save, Send } from 'lucide-react';

export default function QuoteNew() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Mock customers for demo
  const mockCustomers = [
    { id: 'customer-1', name: 'Casey Customer', email: 'customer@example.com' },
    { id: 'customer-2', name: 'Acme Inc.', email: 'acme@example.com' },
    { id: 'customer-3', name: 'TechCorp', email: 'tech@example.com' }
  ];
  
  // State for the quote
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState('30');
  
  // State for new item being added
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    unitPrice: '',
    quantity: '1',
    discount: '0'
  });
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.unitPrice) {
      toast.error('Please provide at least a name and unit price for the item');
      return;
    }
    
    const quantity = parseInt(newItem.quantity, 10) || 1;
    const unitPrice = parseFloat(newItem.unitPrice) || 0;
    const discount = parseFloat(newItem.discount) || 0;
    
    // Calculate total with discount
    const total = quantity * unitPrice * (1 - discount / 100);
    
    const item: QuoteItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      unitPrice,
      quantity,
      discount: discount > 0 ? discount : undefined,
      total
    };
    
    setItems([...items, item]);
    
    // Reset the new item form
    setNewItem({
      name: '',
      description: '',
      unitPrice: '',
      quantity: '1',
      discount: '0'
    });
  };
  
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountTotal = items.reduce((sum, item) => {
      if (!item.discount) return sum;
      return sum + (item.unitPrice * item.quantity * (item.discount / 100));
    }, 0);
    
    // Add 8% tax
    const tax = subtotal * 0.08;
    
    return {
      subtotal,
      discountTotal: discountTotal > 0 ? discountTotal : undefined,
      tax,
      total: subtotal + tax
    };
  };
  
  const createQuote = (isDraft: boolean = true) => {
    if (!selectedCustomer || items.length === 0) {
      toast.error('Please select a customer and add at least one item to the quote');
      return;
    }
    
    const customer = mockCustomers.find(c => c.id === selectedCustomer);
    if (!customer) {
      toast.error('Please select a valid customer');
      return;
    }
    
    const totals = calculateTotals();
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(validDays, 10));
    
    const quote: ProductQuote = {
      id: `Q${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      tax: totals.tax,
      total: totals.total,
      status: isDraft ? 'draft' : 'sent',
      notes,
      validUntil,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser?.id || 'unknown'
    };
    
    // In a real app, we'd save this to a database
    console.log('Created quote:', quote);
    
    toast.success(
      isDraft 
        ? 'Quote saved as draft'
        : 'Quote sent to customer'
    );
    
    // Go back to quotes list
    navigate('/quotes');
  };
  
  // Prepare mock quote for the summary preview
  const quotePreview: ProductQuote = {
    id: 'preview',
    customerId: selectedCustomer,
    customerName: mockCustomers.find(c => c.id === selectedCustomer)?.name || 'Customer',
    customerEmail: mockCustomers.find(c => c.id === selectedCustomer)?.email || 'customer@example.com',
    items,
    ...calculateTotals(),
    status: 'draft',
    validUntil: new Date(new Date().setDate(new Date().getDate() + parseInt(validDays, 10))),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: currentUser?.id || 'unknown'
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate('/quotes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Quote</h1>
          <p className="text-muted-foreground">
            Create a new quote for a customer with custom products and services.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select 
                    value={selectedCustomer} 
                    onValueChange={setSelectedCustomer}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.length > 0 ? (
                <QuoteItemList items={items} editable={true} onRemove={handleRemoveItem} />
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No items added to this quote yet.</p>
                </div>
              )}
              
              {/* Add Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        placeholder="Product or service name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemDescription">Description</Label>
                      <Input
                        id="itemDescription"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        placeholder="Brief description"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemPrice">Unit Price ($)</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemQuantity">Quantity</Label>
                      <Input
                        id="itemQuantity"
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemDiscount">Discount (%)</Label>
                      <Input
                        id="itemDiscount"
                        type="number"
                        min="0"
                        max="100"
                        value={newItem.discount}
                        onChange={(e) => setNewItem({...newItem, discount: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item to Quote
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          
          {/* Notes and Validity */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes or terms for this quote..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validity">Valid For (Days)</Label>
                  <Input
                    id="validity"
                    type="number"
                    min="1"
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quote Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Summary of the quote to be created
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span className="font-medium">
                    {selectedCustomer 
                      ? mockCustomers.find(c => c.id === selectedCustomer)?.name 
                      : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Validity:</span>
                  <span className="font-medium">{validDays} days</span>
                </div>
              </div>
              
              {items.length > 0 && <QuoteSummary quote={quotePreview} />}
              
              <div className="pt-6 space-y-4">
                <Button 
                  onClick={() => createQuote(false)} 
                  className="w-full"
                  disabled={!selectedCustomer || items.length === 0}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Quote to Customer
                </Button>
                
                <Button 
                  onClick={() => createQuote(true)} 
                  variant="outline" 
                  className="w-full"
                  disabled={!selectedCustomer || items.length === 0}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
