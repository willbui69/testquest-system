
import { useState, useEffect } from 'react';
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
import { getAllRequests } from '@/services/requestService';

// Helper function to convert test requests to test assignments
const mapRequestsToAssignments = (requests: any[]) => {
  return requests
    .filter(req => req.status === 'registered' || req.status === 'testing')
    .map(req => ({
      id: `ITEM${req.id.substring(3)}`,
      requestId: req.id,
      barcode: `BC${req.id.substring(3)}`,
      name: req.itemName,
      description: req.itemDescription || 'No description available',
      assignedTesterId: 'tester-1',
      priority: req.priority || 'medium',
      status: req.status === 'registered' ? 'pending' : 'in_progress',
      customerName: req.customerName,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] // Due date is 7 days from now
    }));
};

export function TestAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Load assignments on component mount
  useEffect(() => {
    const requests = getAllRequests();
    const mappedAssignments = mapRequestsToAssignments(requests);
    setAssignments(mappedAssignments);
  }, []);
  
  // Start test for an assignment
  const handleStartTest = (requestId: string) => {
    navigate(`/test-data-entry/${requestId}`);
  };
  
  // View test results for a completed test
  const handleViewResults = (requestId: string) => {
    navigate(`/results/${requestId}`);
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
          {assignments.map((assignment) => (
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
          
          {assignments.length === 0 && (
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
