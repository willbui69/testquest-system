
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExtractedPdfData } from '@/types';
import { CheckCircle, FileText } from 'lucide-react';

interface ExtractedDataReviewProps {
  extractedData: ExtractedPdfData;
  formData: any;
  onFormDataChange: (updatedData: any) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExtractedDataReview({
  extractedData,
  formData,
  onFormDataChange,
  onClose,
  onConfirm
}: ExtractedDataReviewProps) {
  // Helper function to update form data
  const updateFormData = (field: string, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  // Map result values to form fields based on key
  const mapResultToFormField = () => {
    if (!extractedData.resultValues) return;

    // Try to map common result keys to form fields
    const mappings: Record<string, string> = {
      'voltage': 'voltage',
      'power': 'powerMain',
      'input': 'input1',
      'output': 'output1'
    };

    // Apply mappings where possible
    Object.entries(extractedData.resultValues).forEach(([key, value]) => {
      const formField = mappings[key.toLowerCase()];
      if (formField && !formData[formField]) {
        updateFormData(formField, value);
      }
    });
  };

  // Call mapping function when component mounts
  React.useEffect(() => {
    mapResultToFormField();
    
    // Set any additional extracted data to form
    if (extractedData.summary && !formData.additionalNotes) {
      updateFormData('additionalNotes', extractedData.summary);
    }
  }, [extractedData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Review Extracted Data
        </CardTitle>
        <CardDescription>
          The following information was extracted from your uploaded file.
          Please review and edit if necessary before confirming.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Extracted Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {extractedData.testId && (
              <div>
                <span className="font-medium">Test ID:</span> {extractedData.testId}
              </div>
            )}
            {extractedData.timestamp && (
              <div>
                <span className="font-medium">Date:</span> {new Date(extractedData.timestamp).toLocaleDateString()}
              </div>
            )}
            {extractedData.technician && (
              <div>
                <span className="font-medium">Technician:</span> {extractedData.technician}
              </div>
            )}
            {extractedData.analysisStatus && (
              <div>
                <span className="font-medium">Status:</span> {extractedData.analysisStatus}
              </div>
            )}
          </div>

          {extractedData.resultValues && Object.keys(extractedData.resultValues).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Test Results:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(extractedData.resultValues).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Edit Request Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => updateFormData('itemName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Input
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => updateFormData('itemDescription', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => updateFormData('quantity', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => updateFormData('priority', value)}
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

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>
          Confirm and Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
