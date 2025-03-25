
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
import { ArrowLeft, FileText, Send, Beaker } from 'lucide-react';

// List of safety and compliance tests available
const availableTests = [
  { id: 'ul1642', name: 'Battery Cell - UL1642', description: 'Safety testing for lithium batteries' },
  { id: 'ul2056', name: 'Power Bank - UL2056', description: 'Safety standard for power banks' },
  { id: 'un383', name: 'Battery - UN38.3', description: 'Transport testing for lithium batteries' },
  { id: 'iec62133', name: 'Battery - IEC62133', description: 'Safety requirements for batteries' },
  { id: 'ul2054', name: 'Battery Pack - UL2054', description: 'Household and commercial battery testing' },
  { id: 'ul1642cb', name: 'Battery Cell - UL1642 CB', description: 'CB Scheme for lithium batteries' }
];

export default function CustomerRequest() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    testType: '',
    itemName: '',
    itemDescription: '',
    quantity: '1',
    priority: 'medium' as 'low' | 'medium' | 'high',
    placeOfOrigin: '',
    brandName: '',
    modelNumber: '',
    certification: '',
    additionalNotes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If selecting a test type, update the item name field
    if (field === 'testType') {
      const selectedTest = availableTests.find(test => test.id === value);
      if (selectedTest) {
        setFormData(prev => ({ 
          ...prev, 
          itemName: selectedTest.name,
          itemDescription: selectedTest.description
        }));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.testType || !formData.itemName) {
      toast.error('Please select a test type and provide an item name');
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
        <h1 className="text-3xl font-bold tracking-tight">Submit Compliance Test Request</h1>
        <p className="text-muted-foreground">
          Complete the form below to submit a new compliance test request for your items.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              Test Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select 
                value={formData.testType} 
                onValueChange={(value) => handleSelectChange('testType', value)}
              >
                <SelectTrigger id="testType">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  {availableTests.map(test => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placeOfOrigin">Place of Origin</Label>
                <Input
                  id="placeOfOrigin"
                  value={formData.placeOfOrigin}
                  onChange={handleChange}
                  placeholder="e.g., China, USA, Germany"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="e.g., TechPower, EnergyPlus"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input
                  id="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleChange}
                  placeholder="e.g., BP-2000, BC-X15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certification">Required Certification</Label>
                <Input
                  id="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="e.g., CE, FCC, RoHS"
                />
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
