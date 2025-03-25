
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ClipboardList, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TestItem } from '@/types';

// Mock data - would come from API in a real application
const mockAssignments: (TestItem & { 
  requestId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  customerName: string;
  dueDate: string;
})[] = [
  { 
    id: 'ITEM001', 
    requestId: 'REQ001', 
    barcode: 'BC00123', 
    name: 'Circuit Board', 
    description: 'Power supply circuit board', 
    assignedTesterId: 'tester-1',
    priority: 'high',
    status: 'pending',
    customerName: 'Acme Inc.',
    dueDate: '2023-07-15'
  },
  { 
    id: 'ITEM002', 
    requestId: 'REQ002', 
    barcode: 'BC00124', 
    name: 'Power Supply', 
    description: '24V DC power supply', 
    assignedTesterId: 'tester-1',
    priority: 'medium',
    status: 'in_progress',
    customerName: 'TechCorp',
    dueDate: '2023-07-18'
  },
  { 
    id: 'ITEM003', 
    requestId: 'REQ003', 
    barcode: 'BC00125', 
    name: 'Sensor Array', 
    description: 'Temperature and humidity sensor array', 
    assignedTesterId: 'tester-1',
    priority: 'low',
    status: 'completed',
    customerName: 'InnoSys',
    dueDate: '2023-07-10'
  },
];

export function TestAssignments() {
  const navigate = useNavigate();
  
  // Start test for an assignment
  const handleStartTest = (requestId: string) => {
    navigate(`/test-data-entry/${requestId}`);
  };
  
  // View test results for a completed test
  const handleViewResults = (requestId: string) => {
    // In a real app, this would navigate to a results page
    console.log(`View results for ${requestId}`);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAssignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{assignment.name}</div>
                  <div className="text-sm text-muted-foreground">{assignment.barcode}</div>
                </div>
              </TableCell>
              <TableCell>{assignment.customerName}</TableCell>
              <TableCell>
                <PriorityBadge priority={assignment.priority} />
              </TableCell>
              <TableCell>
                <StatusBadge status={assignment.status} />
              </TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell className="text-right">
                {assignment.status === 'completed' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewResults(assignment.requestId)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleStartTest(assignment.requestId)}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    {assignment.status === 'in_progress' ? 'Continue Test' : 'Start Test'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {mockAssignments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No assignments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper component for priority badges
function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' }) {
  const color = 
    priority === 'high' ? 'bg-red-100 text-red-800' : 
    priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
    'bg-slate-100 text-slate-800';
  
  return (
    <Badge variant="outline" className={`${color}`}>
      {priority}
    </Badge>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: 'pending' | 'in_progress' | 'completed' }) {
  const color = 
    status === 'completed' ? 'bg-green-100 text-green-800' : 
    status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
    'bg-slate-100 text-slate-800';
  
  return (
    <Badge variant="outline" className={`${color}`}>
      {status.replace('_', ' ')}
    </Badge>
  );
}
