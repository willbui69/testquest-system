
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PdfUploader from './PdfUploader';
import { ExtractedPdfData } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface TesterDataEntryProps {
  requestId: string;
  onSave: (data: any) => void;
}

export default function TesterDataEntry({ requestId, onSave }: TesterDataEntryProps) {
  const [formData, setFormData] = useState({
    testId: '',
    results: '',
    notes: ''
  });
  const [extractedData, setExtractedData] = useState<ExtractedPdfData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDataExtracted = (data: ExtractedPdfData) => {
    setExtractedData(data);
    setIsDialogOpen(true);
  };

  const applyExtractedData = () => {
    if (!extractedData) return;
    
    // Convert extracted values to a string format for the results textarea
    const resultsText = Object.entries(extractedData.resultValues || {})
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join('\n');
    
    // Add equipment list if available
    const equipmentText = extractedData.equipment?.length
      ? '\n\nEquipment Used:\n' + extractedData.equipment.join('\n')
      : '';
    
    // Add summary if available
    const summaryText = extractedData.summary
      ? '\n\nSummary:\n' + extractedData.summary
      : '';
    
    // Combine all text
    const fullResultsText = resultsText + equipmentText + summaryText;
    
    setFormData({
      testId: extractedData.testId || formData.testId,
      results: fullResultsText,
      notes: extractedData.summary || formData.notes
    });
    
    setIsDialogOpen(false);
    toast.success('PDF data applied to form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would validate the data here
    
    // Save the test results
    onSave({
      requestId,
      ...formData,
      timestamp: new Date().toISOString()
    });
    
    toast.success('Test results saved successfully');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>Enter test results manually or upload a PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testId">Test ID</Label>
              <Input
                id="testId"
                name="testId"
                value={formData.testId}
                onChange={handleInputChange}
                placeholder="Enter test identifier"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="results">Test Results</Label>
              <Textarea
                id="results"
                name="results"
                value={formData.results}
                onChange={handleInputChange}
                placeholder="Enter test results"
                rows={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any additional notes"
                rows={4}
              />
            </div>
            
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Results
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* PDF Uploader */}
      <PdfUploader onDataExtracted={handleDataExtracted} />
      
      {/* Dialog to preview extracted data */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Data Preview
            </DialogTitle>
            <DialogDescription>
              Review the data extracted from your PDF file
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            {extractedData?.testId && (
              <div>
                <h4 className="text-sm font-medium">Test ID</h4>
                <p className="text-sm">{extractedData.testId}</p>
              </div>
            )}
            
            {extractedData?.resultValues && Object.keys(extractedData.resultValues).length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Results</h4>
                <div className="bg-muted rounded-md p-3 mt-1">
                  {Object.entries(extractedData.resultValues).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2 text-sm py-1">
                      <span className="capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {extractedData?.equipment && extractedData.equipment.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Equipment Used</h4>
                <ul className="list-disc list-inside text-sm mt-1">
                  {extractedData.equipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {extractedData?.summary && (
              <div>
                <h4 className="text-sm font-medium">Summary</h4>
                <p className="text-sm mt-1">{extractedData.summary}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyExtractedData}>
              <Upload className="mr-2 h-4 w-4" />
              Apply Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
