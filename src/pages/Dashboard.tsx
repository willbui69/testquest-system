import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardCard from '@/components/ui/DashboardCard';
import ProcessFlow from '@/components/ui/ProcessFlow';
import RegisterItemDialog from '@/components/reception/RegisterItemDialog';
import { ProcessStep } from '@/types';
import {
  BarChart3,
  Beaker,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Package,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const mockRequests = [
  { id: 'REQ001', customer: 'Acme Inc.', item: 'Circuit Board', priority: 'high', status: 'registered', date: '2023-06-15', currentStep: 'item_registered' as ProcessStep },
  { id: 'REQ002', customer: 'TechCorp', item: 'Power Supply', priority: 'medium', status: 'testing', date: '2023-06-18', currentStep: 'testing_assigned' as ProcessStep },
  { id: 'REQ003', customer: 'InnoSys', item: 'Sensor Array', priority: 'low', status: 'completed', date: '2023-06-20', currentStep: 'testing_completed' as ProcessStep },
  { id: 'REQ004', customer: 'DataTech', item: 'Memory Module', priority: 'high', status: 'reviewed', date: '2023-06-22', currentStep: 'customer_review' as ProcessStep },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  registered: 'bg-blue-100 text-blue-800',
  testing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  reviewed: 'bg-indigo-100 text-indigo-800',
  approved: 'bg-emerald-100 text-emerald-800',
  finalized: 'bg-teal-100 text-teal-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const role = currentUser?.role || 'customer';

  const stats = {
    sales: [
      { title: 'New Requests', value: '24', icon: <ClipboardList size={20} />, trend: { value: 12, direction: 'up' } },
      { title: 'Active Customers', value: '56', icon: <Users size={20} /> },
      { title: 'Avg. Processing Time', value: '3.2 days', icon: <Clock size={20} /> },
      { title: 'Completed Tests', value: '42', icon: <CheckCircle size={20} />, trend: { value: 8, direction: 'up' } },
    ],
    reception: [
      { title: 'Pending Registration', value: '8', icon: <Package size={20} />, trend: { value: 2, direction: 'down' } },
      { title: 'Assigned Tests', value: '15', icon: <Beaker size={20} /> },
      { title: 'Reports to Process', value: '7', icon: <FileText size={20} /> },
      { title: 'Items in System', value: '36', icon: <ClipboardList size={20} /> },
    ],
    tester: [
      { title: 'My Assignments', value: '5', icon: <Beaker size={20} /> },
      { title: 'Completed Today', value: '3', icon: <CheckCircle size={20} /> },
      { title: 'Pending Results', value: '2', icon: <Clock size={20} /> },
      { title: 'Avg. Test Time', value: '4.5 hours', icon: <Clock size={20} /> },
    ],
    manager: [
      { title: 'Pending Approvals', value: '12', icon: <FileText size={20} />, trend: { value: 3, direction: 'up' } },
      { title: 'Staff Performance', value: '94%', icon: <BarChart3 size={20} />, trend: { value: 2, direction: 'up' } },
      { title: 'Active Tests', value: '28', icon: <Beaker size={20} /> },
      { title: 'Monthly Reports', value: '87', icon: <FileText size={20} />, trend: { value: 12, direction: 'up' } },
    ],
    customer: [
      { title: 'Active Requests', value: '3', icon: <ClipboardList size={20} /> },
      { title: 'Completed Tests', value: '8', icon: <CheckCircle size={20} /> },
      { title: 'Available Reports', value: '5', icon: <FileText size={20} />, trend: { value: 2, direction: 'up' } },
      { title: 'Avg. Completion Time', value: '4.3 days', icon: <Clock size={20} /> },
    ],
  };

  const filteredRequests = mockRequests.filter(request => {
    if (role === 'sales' || role === 'reception' || role === 'manager') {
      return true;
    } else if (role === 'tester') {
      return request.status === 'testing';
    } else if (role === 'customer') {
      return true;
    }
    return false;
  });

  const handleAction = (action: string, requestId: string) => {
    if (action === 'test' && role === 'tester') {
      navigate(`/test-data-entry/${requestId}`);
    } else {
      toast.success(`Action ${action} performed on request ${requestId}`);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.name}</h1>
                <p className="text-muted-foreground">Here's what's happening with your test requests today.</p>
              </div>
              
              {role === 'sales' && (
                <Button onClick={() => toast.success('New request created')} className="mt-4 sm:mt-0">
                  New Request
                </Button>
              )}
              {role === 'reception' && (
                <RegisterItemDialog />
              )}
              {role === 'customer' && (
                <Button onClick={() => toast.success('New request created')} className="mt-4 sm:mt-0">
                  Submit Request
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats[role]?.map((stat, i) => (
                <DashboardCard 
                  key={i}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  trend={stat.trend}
                  className={`animate-fade-up delay-${i * 100}`}
                />
              ))}
            </div>
            
            <Tabs defaultValue="requests" className="w-full animate-fade-up">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="process">Process Flow</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Requests</CardTitle>
                    <CardDescription>Manage and monitor your test requests.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-3 text-left font-medium">ID</th>
                              <th className="px-4 py-3 text-left font-medium">Customer</th>
                              <th className="px-4 py-3 text-left font-medium">Item</th>
                              <th className="px-4 py-3 text-left font-medium">Priority</th>
                              <th className="px-4 py-3 text-left font-medium">Status</th>
                              <th className="px-4 py-3 text-left font-medium">Date</th>
                              <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRequests.map((request) => (
                              <tr key={request.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-medium">{request.id}</td>
                                <td className="px-4 py-3">{request.customer}</td>
                                <td className="px-4 py-3">{request.item}</td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${priorityColors[request.priority]}`}>
                                    {request.priority}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusColors[request.status]}`}>
                                    {request.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3">{request.date}</td>
                                <td className="px-4 py-3 text-right">
                                  {role === 'sales' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleAction('view', request.id)}>
                                      View
                                    </Button>
                                  )}
                                  {role === 'reception' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleAction('process', request.id)}>
                                      Process
                                    </Button>
                                  )}
                                  {role === 'tester' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleAction('test', request.id)}>
                                      Record Results
                                    </Button>
                                  )}
                                  {role === 'manager' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleAction('approve', request.id)}>
                                      Approve
                                    </Button>
                                  )}
                                  {role === 'customer' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleAction('download', request.id)}>
                                      Download
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="process" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Process Flow</CardTitle>
                    <CardDescription>Track the progress of test requests through the system.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredRequests.length > 0 ? (
                      <div className="space-y-8">
                        {filteredRequests.map((request) => (
                          <div key={request.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{request.id} - {request.item}</h3>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusColors[request.status]}`}>
                                {request.status}
                              </span>
                            </div>
                            <ProcessFlow currentStep={request.currentStep} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No active test requests to display.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes in the system.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="h-full w-px bg-border" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">New item registered</p>
                          <p className="text-sm text-muted-foreground">REQ001 - Circuit Board from Acme Inc.</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="h-full w-px bg-border" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">Test assigned to Taylor Tester</p>
                          <p className="text-sm text-muted-foreground">REQ002 - Power Supply from TechCorp</p>
                          <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Beaker className="h-5 w-5 text-primary" />
                          </div>
                          <div className="h-full w-px bg-border" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">Test completed</p>
                          <p className="text-sm text-muted-foreground">REQ003 - Sensor Array from InnoSys</p>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium">Report approved by manager</p>
                          <p className="text-sm text-muted-foreground">REQ004 - Memory Module from DataTech</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
