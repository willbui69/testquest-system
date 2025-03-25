
export type UserRole = 'sales' | 'reception' | 'tester' | 'manager' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TestRequest {
  id: string;
  customerId: string;
  customerName: string;
  itemName: string;
  itemDescription: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'registered' | 'testing' | 'completed' | 'reviewed' | 'approved' | 'finalized';
  createdAt: Date;
  updatedAt: Date;
}

export interface TestItem {
  id: string;
  requestId: string;
  barcode: string;
  name: string;
  description: string;
  assignedTesterId?: string;
}

export interface TestResult {
  id: string;
  itemId: string;
  testerId: string;
  results: string;
  notes: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  requestId: string;
  results: TestResult[];
  status: 'draft' | 'reviewed' | 'approved' | 'finalized';
  approvedBy?: string;
  approvedAt?: Date;
  signedDocumentUrl?: string;
}

export type ProcessStep = 
  | 'request_received' 
  | 'item_registered' 
  | 'testing_assigned'
  | 'testing_completed'
  | 'results_compiled'
  | 'customer_review'
  | 'manager_approval'
  | 'report_finalized';

export interface ExtractedPdfData {
  testId?: string;
  resultValues?: Record<string, string | number>;
  summary?: string;
  timestamp?: string;
  equipment?: string[];
}
