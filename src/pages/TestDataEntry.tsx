
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TesterDataEntry from '@/components/tester/TesterDataEntry';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Mock data - would come from API in a real application
const mockTestRequests = [
  { id: 'REQ001', customer: 'Acme Inc.', item: 'Circuit Board', priority: 'high', status: 'testing' },
  { id: 'REQ002', customer: 'TechCorp', item: 'Power Supply', priority: 'medium', status: 'testing' },
  { id: 'REQ003', customer: 'InnoSys', item: 'Sensor Array', priority: 'low', status: 'testing' },
];

export default function TestDataEntry() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Find the test request from our mock data
  const testRequest = mockTestRequests.find(req => req.id === requestId);
  
  // Handle saving the test data
  const handleSaveTestData = (data: any) => {
    console.log('Saving test data:', data);
    // In a real application, this would make an API call to save the data
    
    toast.success('Test results saved successfully');
    
    // After saving, navigate back to the dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
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
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Test Data Entry</h1>
                  <p className="text-muted-foreground">
                    Record test results for request {requestId}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Test Details */}
            {testRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Test Request Details</CardTitle>
                  <CardDescription>Information about the test request</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Request ID</p>
                      <p className="text-lg">{testRequest.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Item</p>
                      <p className="text-lg">{testRequest.item}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Priority</p>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 
                        ${testRequest.priority === 'high' ? 'bg-rose-100 text-rose-800' : 
                          testRequest.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                          'bg-slate-100 text-slate-800'}`}
                      >
                        {testRequest.priority}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">Test request not found</p>
                </CardContent>
              </Card>
            )}
            
            {/* Data Entry Form with PDF Upload */}
            {testRequest && (
              <TesterDataEntry 
                requestId={requestId || ''} 
                onSave={handleSaveTestData} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
