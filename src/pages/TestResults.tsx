
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import TestResultsView from '@/components/tester/TestResultsView';

// Mock data - would come from API in a real application
const mockTestResults = [
  { 
    id: 'RES001', 
    requestId: 'REQ001', 
    testId: 'TEST-1234',
    item: 'Circuit Board',
    customer: 'Acme Inc.',
    testDate: '2023-07-12',
    results: 'Voltage: 5.2V\nCurrent: 0.4A\nResistance: 10.5Ω\n\nEquipment Used:\nDigital Multimeter DM-934\nPower Supply PS-500\n\nSummary:\nAll parameters within expected ranges',
    notes: 'Test completed without issues'
  },
  { 
    id: 'RES002', 
    requestId: 'REQ002', 
    testId: 'TEST-5678',
    item: 'Power Supply',
    customer: 'TechCorp',
    testDate: '2023-07-15',
    results: 'Output Voltage: 24.1V\nRipple: 20mV\nEfficiency: 92%\n\nEquipment Used:\nOscilloscope OS-200\nLoad Tester LT-100\n\nSummary:\nSome parameters show minor deviations from standard values',
    notes: 'Slight voltage deviation but within acceptable range'
  },
  { 
    id: 'RES003', 
    requestId: 'REQ003', 
    testId: 'TEST-9012',
    item: 'Sensor Array',
    customer: 'InnoSys',
    testDate: '2023-07-08',
    results: 'Temperature Accuracy: ±0.2°C\nHumidity Accuracy: ±1.5%\nResponse Time: 1.2s\n\nEquipment Used:\nCalibrated Chamber CC-500\nData Logger DL-200\n\nSummary:\nTest completed successfully with nominal results',
    notes: 'All sensors performing within specifications'
  }
];

export default function TestResults() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Find the test result from our mock data
  const testResult = mockTestResults.find(res => res.requestId === requestId);
  
  // Handle downloading the test report
  const handleDownloadReport = () => {
    // In a real application, this would generate and download a PDF
    console.log('Downloading report for', requestId);
    // Just for demo purposes, show a success message in console
    console.log('Report downloaded successfully');
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate('/assignments')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
                  <p className="text-muted-foreground">
                    Viewing test results for request {requestId}
                  </p>
                </div>
              </div>
              
              <Button 
                className="mt-4 sm:mt-0"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
            
            {/* Test Result Details */}
            {testResult ? (
              <TestResultsView testResult={testResult} />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Test result not found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
