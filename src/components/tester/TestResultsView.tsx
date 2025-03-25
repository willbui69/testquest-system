
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, User, Clipboard, Sparkles } from 'lucide-react';

interface TestResultViewProps {
  testResult: {
    id: string;
    requestId: string;
    testId: string;
    item: string;
    customer: string;
    testDate: string;
    results: string;
    notes: string;
  };
}

export default function TestResultsView({ testResult }: TestResultViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
          <CardDescription>Overview of the completed test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Test ID</p>
                  <p className="text-lg">{testResult.testId}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clipboard className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Item Tested</p>
                  <p className="text-lg">{testResult.item}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-lg">{testResult.customer}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Test Date</p>
                  <p className="text-lg">{testResult.testDate}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" /> 
            Test Results
          </CardTitle>
          <CardDescription>Detailed measurements and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
            {testResult.results}
          </div>
        </CardContent>
      </Card>
      
      {/* Notes Card */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Additional observations and comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <p>{testResult.notes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
