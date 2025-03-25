
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Send } from 'lucide-react';

export default function CustomerRequest() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    quantity: '1',
    priority: 'medium' as 'low' | 'medium' | 'high',
    additionalNotes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName) {
      toast.error('Please provide an item name');
      return;
    }
    
    // In a real app, we'd send this data to a server
    console.log('Submitting test request:', formData);
    
    toast.success('Your test request has been submitted successfully!');
    
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Submit Test Request</h1>
        <p className="text-muted-foreground">
          Complete the form below to submit a new test request for your items.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Name of the item to be tested"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Description</Label>
              <Textarea
                id="itemDescription"
                value={formData.itemDescription}
                onChange={handleChange}
                placeholder="Detailed description of the item"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any additional information or special requirements"
                rows={4}
              />
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </Button>
              
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
