
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, Beaker } from 'lucide-react';
import TestResultsView from '@/components/tester/TestResultsView';

// Mock data - would come from API in a real application
const mockTestResults = [
  { 
    id: 'RES001', 
    requestId: 'REQ001', 
    testId: 'BATT-UL1642-001',
    item: 'Battery Cell - UL1642',
    customer: 'PowerTech Industries',
    placeOfOrigin: 'China',
    brandName: 'PowerCell',
    modelNumber: 'PC-L18650',
    certification: 'UL1642, IEC62133',
    testDate: '2023-07-12',
    results: 'Voltage: 3.7V\nCapacity: 2600mAh\nInternal Resistance: 25mΩ\nShort Circuit Test: PASS\nCrush Test: PASS\nOvercharge Test: PASS\nForced Discharge: PASS\n\nEquipment Used:\nBattery Testing System BTS-2000 (Cal: 2023-05-15)\nEnvironmental Chamber EC-500 (Cal: 2023-03-20)\nImpact Tester IT-100 (Cal: 2023-04-10)\n\nReference Standards:\nUL1642:2012\nIEC62133-2:2017\n\nTechnician: J. Smith\n\nStatus: PASS\n\nSummary:\nAll tests completed successfully. The battery cell meets UL1642 safety requirements.',
    notes: 'Sample provided was in good condition. Test completed as per standard procedures.'
  },
  { 
    id: 'RES002', 
    requestId: 'REQ002', 
    testId: 'PB-UL2056-002',
    item: 'Power Bank - UL2056',
    customer: 'MobilePower Corp',
    placeOfOrigin: 'Taiwan',
    brandName: 'TravelCharge',
    modelNumber: 'TC-10000',
    certification: 'UL2056, CE, FCC',
    testDate: '2023-07-15',
    results: 'Capacity: 10000mAh\nInput: 5V/2A\nOutput: 5V/2.4A\nShort Circuit Protection: PASS\nOvercharge Protection: PASS\nOver-discharge Protection: PASS\nTemperature Cycling: PASS\nDrop Test: PASS\n\nEquipment Used:\nDigital Load Tester DLT-500 (Cal: 2023-06-22)\nData Acquisition System DAQ-2000 (Cal: 2023-05-18)\nEnvironmental Chamber EC-1000 (Cal: 2023-02-15)\n\nReference Standards:\nUL2056:2020\nIEC60950-1\n\nTechnician: A. Johnson\n\nStatus: PASS\n\nSummary:\nThe power bank meets all safety requirements specified in UL2056 standard.',
    notes: 'Customer requested additional thermal cycling tests which were also passed successfully.'
  },
  { 
    id: 'RES003', 
    requestId: 'REQ003', 
    testId: 'BATT-UN383-003',
    item: 'Battery Pack - UN38.3',
    customer: 'InnoSys Electronics',
    placeOfOrigin: 'Japan',
    brandName: 'EnergySafe',
    modelNumber: 'ES-LP5200',
    certification: 'UN38.3, MSDS',
    testDate: '2023-07-08',
    results: 'Altitude Simulation: PASS\nThermal Test: PASS\nVibration: PASS\nShock: PASS\nExternal Short Circuit: PASS\nImpact/Crush: PASS\nOvercharge: PASS\nForced Discharge: PASS\n\nEquipment Used:\nVibration Tester VT-500 (Cal: 2023-05-20)\nShock Tester ST-100 (Cal: 2023-04-25)\nClimatic Chamber CC-800 (Cal: 2023-03-15)\nData Logger DL-200 (Cal: 2023-07-01)\n\nReference Standards:\nUN Manual of Tests and Criteria, Part III, Section 38.3\nIATA DGR 64th Edition\n\nTechnician: M. Williams\n\nStatus: PASS\n\nSummary:\nAll required tests for lithium battery transport safety have been completed successfully. The battery meets UN38.3 requirements.',
    notes: 'This certification allows the battery to be transported internationally by air, sea, and land as non-dangerous goods.'
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
