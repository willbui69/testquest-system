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
import { ArrowLeft, FileText, Send, Beaker, Upload } from 'lucide-react';
import { addRequest } from '@/services/requestService';
import PdfUploader from '@/components/tester/PdfUploader';
import { ExtractedPdfData } from '@/types';
import { ExtractedDataReview } from '@/components/customer/ExtractedDataReview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    additionalNotes: '',
    // Technical specifications for the table format
    sampleNo: '',
    // Main EUT
    voltage: '',
    powerMain: '',
    cpu: '',
    gpu: '',
    // Power supply unit #1
    input1: '',
    output1: '',
    power1: '',
    // Power supply unit #2
    input2: '',
    output2: '',
    power2: '',
    // Power supply unit #3
    input3: '',
    output3: '',
    power3: '',
  });
  
  const [extractedData, setExtractedData] = useState<ExtractedPdfData | null>(null);
  const [showDataReview, setShowDataReview] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  
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
  
  const handleDataExtracted = (data: ExtractedPdfData) => {
    console.log('Extracted data:', data);
    setExtractedData(data);
    setShowDataReview(true);
    
    // If we have a test description in the summary, try to find matching test type
    if (data.summary) {
      const lowerSummary = data.summary.toLowerCase();
      const matchedTest = availableTests.find(test => 
        lowerSummary.includes(test.name.toLowerCase()) || 
        lowerSummary.includes(test.description.toLowerCase())
      );
      
      if (matchedTest) {
        setFormData(prev => ({
          ...prev,
          testType: matchedTest.id,
          itemName: matchedTest.name,
          itemDescription: matchedTest.description
        }));
      }
    }
  };
  
  const handleFormDataChange = (updatedData: any) => {
    setFormData(updatedData);
  };
  
  const handleDataReviewClose = () => {
    setShowDataReview(false);
  };
  
  const handleDataReviewConfirm = () => {
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
    setShowDataReview(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName) {
      toast.error('Please provide an item name');
      return;
    }
    
    // Create the test request
    const request = {
      customerId: currentUser?.id || 'unknown',
      customerName: currentUser?.name || 'Unknown Customer',
      itemName: formData.itemName,
      itemDescription: formData.itemDescription,
      quantity: parseInt(formData.quantity) || 1,
      priority: formData.priority,
    };
    
    // Save the request using our service
    try {
      const savedRequest = addRequest(request);
      console.log('Submitted test request:', savedRequest);
      
      toast.success('Your test request has been submitted successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('There was an error submitting your request. Please try again.');
    }
  };
  
  // If showing data review, render it
  if (showDataReview && extractedData) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => setShowDataReview(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Request Form
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Review Extracted Data</h1>
          <p className="text-muted-foreground">
            Review and edit the information extracted from your uploaded file.
          </p>
        </div>
        
        <ExtractedDataReview
          extractedData={extractedData}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onClose={handleDataReviewClose}
          onConfirm={handleDataReviewConfirm}
        />
      </div>
    );
  }
  
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
      
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="upload">Upload PDF</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 w-16 text-center">No.</th>
                        <th className="border p-2 w-1/2 text-left">SPECIFICATIONS</th>
                        <th className="border p-2 w-1/2 text-left">VALUES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample No. 1 */}
                      <tr>
                        <td className="border p-2 text-center" rowSpan={10}>1</td>
                        <td className="border p-2 font-medium">Sample No.</td>
                        <td className="border p-2">
                          <Input
                            id="sampleNo"
                            value={formData.sampleNo}
                            onChange={handleChange}
                            placeholder="Enter sample number"
                          />
                        </td>
                      </tr>
                      
                      {/* Main EUT */}
                      <tr>
                        <td className="border p-2 font-medium bg-gray-50" colSpan={2}>
                          Main EUT
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Voltage
                        </td>
                        <td className="border p-2">
                          <Input
                            id="voltage"
                            value={formData.voltage}
                            onChange={handleChange}
                            placeholder="e.g., 110-240V"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Power
                        </td>
                        <td className="border p-2">
                          <Input
                            id="powerMain"
                            value={formData.powerMain}
                            onChange={handleChange}
                            placeholder="e.g., 45W"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> CPU
                        </td>
                        <td className="border p-2">
                          <Input
                            id="cpu"
                            value={formData.cpu}
                            onChange={handleChange}
                            placeholder="e.g., Intel i5-1135G7"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Graphics card (GPU)
                        </td>
                        <td className="border p-2">
                          <Input
                            id="gpu"
                            value={formData.gpu}
                            onChange={handleChange}
                            placeholder="e.g., Intel Iris Xe"
                          />
                        </td>
                      </tr>
                      
                      {/* Power supply unit #1 */}
                      <tr>
                        <td className="border p-2 font-medium bg-gray-50" colSpan={2}>
                          Power supply unit #1
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Input
                        </td>
                        <td className="border p-2">
                          <Input
                            id="input1"
                            value={formData.input1}
                            onChange={handleChange}
                            placeholder="e.g., 100-240V AC"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Output
                        </td>
                        <td className="border p-2">
                          <Input
                            id="output1"
                            value={formData.output1}
                            onChange={handleChange}
                            placeholder="e.g., 19.5V DC, 2.31A"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Power
                        </td>
                        <td className="border p-2">
                          <Input
                            id="power1"
                            value={formData.power1}
                            onChange={handleChange}
                            placeholder="e.g., 45W"
                          />
                        </td>
                      </tr>
                      
                      {/* Sample No. 2 */}
                      <tr>
                        <td className="border p-2 text-center" rowSpan={4}>2</td>
                        <td className="border p-2 font-medium">Sample No.</td>
                        <td className="border p-2">
                          <Input
                            id="sampleNo2"
                            placeholder="Enter sample number"
                            disabled
                          />
                        </td>
                      </tr>
                      
                      {/* Power supply unit #2 */}
                      <tr>
                        <td className="border p-2 font-medium bg-gray-50" colSpan={2}>
                          Power supply unit #2
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Input
                        </td>
                        <td className="border p-2">
                          <Input
                            id="input2"
                            value={formData.input2}
                            onChange={handleChange}
                            placeholder="e.g., 100-240V AC"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Output
                        </td>
                        <td className="border p-2">
                          <Input
                            id="output2"
                            value={formData.output2}
                            onChange={handleChange}
                            placeholder="e.g., 19.5V DC, 2.31A"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Power
                        </td>
                        <td className="border p-2">
                          <Input
                            id="power2"
                            value={formData.power2}
                            onChange={handleChange}
                            placeholder="e.g., 45W"
                          />
                        </td>
                      </tr>
                      
                      {/* Sample No. 3 */}
                      <tr>
                        <td className="border p-2 text-center" rowSpan={4}>3</td>
                        <td className="border p-2 font-medium">Sample No.</td>
                        <td className="border p-2">
                          <Input
                            id="sampleNo3"
                            placeholder="Enter sample number"
                            disabled
                          />
                        </td>
                      </tr>
                      
                      {/* Power supply unit #3 */}
                      <tr>
                        <td className="border p-2 font-medium bg-gray-50" colSpan={2}>
                          Power supply unit #3
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Input
                        </td>
                        <td className="border p-2">
                          <Input
                            id="input3"
                            value={formData.input3}
                            onChange={handleChange}
                            placeholder="e.g., 100-240V AC"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Output
                        </td>
                        <td className="border p-2">
                          <Input
                            id="output3"
                            value={formData.output3}
                            onChange={handleChange}
                            placeholder="e.g., 19.5V DC, 2.31A"
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="border p-2 pl-6">
                          <span className="mr-2">-</span> Power
                        </td>
                        <td className="border p-2">
                          <Input
                            id="power3"
                            value={formData.power3}
                            onChange={handleChange}
                            placeholder="e.g., 45W"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Request Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-lg mx-auto">
                <PdfUploader onDataExtracted={handleDataExtracted} className="w-full" />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Upload a PDF file containing test requirements. We'll extract the information and create a request for you.</p>
                  <p className="mt-2">You'll have a chance to review and edit the extracted data before submitting.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
