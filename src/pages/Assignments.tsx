
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestAssignments } from '@/components/tester/TestAssignments';
import { PlusCircle } from 'lucide-react';

export default function Assignments() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
                <p className="text-muted-foreground">
                  Manage your test assignments and record results
                </p>
              </div>
              
              {currentUser?.role === 'tester' && (
                <Button 
                  className="mt-4 sm:mt-0"
                  onClick={() => {
                    // In a real app, this might open a dialog to claim new assignments
                    console.log('Claim new assignment clicked');
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Claim Assignment
                </Button>
              )}
            </div>
            
            {/* Assignments section */}
            <Card>
              <CardHeader>
                <CardTitle>Test Assignments</CardTitle>
                <CardDescription>
                  View and manage your current test assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestAssignments />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
