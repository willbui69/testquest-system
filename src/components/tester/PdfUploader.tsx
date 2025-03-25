
import { useState } from 'react';
import { FileUp, AlertCircle, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ExtractedPdfData } from '@/types';
import { extractPdfData } from '@/lib/pdf-extractor';

interface PdfUploaderProps {
  onDataExtracted: (data: ExtractedPdfData) => void;
  className?: string;
}

export default function PdfUploader({ onDataExtracted, className }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Extract data from the PDF
      const extractedData = await extractPdfData(file);
      
      if (!extractedData || Object.keys(extractedData).length === 0) {
        throw new Error('No data could be extracted from the PDF');
      }
      
      // Pass the extracted data to the parent component
      onDataExtracted(extractedData);
      
      toast.success('PDF data extracted successfully');
      
    } catch (err) {
      console.error('Error extracting PDF data:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract data from PDF');
      toast.error('Failed to extract data from PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Data Extraction
        </CardTitle>
        <CardDescription>
          Upload a PDF report to automatically extract test results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-2">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50">
              {file ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <Check className="h-8 w-8 text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Drag and drop your PDF file</p>
                  <p className="text-sm text-muted-foreground">
                    Or click to browse your files
                  </p>
                </div>
              )}
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                Select PDF
              </Button>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? 'Extracting data...' : 'Extract Data'}
        </Button>
      </CardFooter>
    </Card>
  );
}
