
import { TestRequest, ProcessStep } from '@/types';

// Use localStorage to persist test requests between sessions
const STORAGE_KEY = 'test_requests';

// Get initial requests from either localStorage or use mock data
const mockRequests = [
  { id: 'REQ001', customerId: 'cust-001', customerName: 'PowerTech Industries', itemName: 'Battery Cell - UL1642', itemDescription: 'Lithium battery cell safety testing', quantity: 2, priority: 'high', status: 'registered', createdAt: new Date('2023-06-15'), updatedAt: new Date('2023-06-15'), currentStep: 'item_registered' as ProcessStep },
  { id: 'REQ002', customerId: 'cust-002', customerName: 'MobilePower Corp', itemName: 'Power Bank - UL2056', itemDescription: 'Power bank safety evaluation', quantity: 1, priority: 'medium', status: 'testing', createdAt: new Date('2023-06-18'), updatedAt: new Date('2023-06-18'), currentStep: 'testing_assigned' as ProcessStep },
  { id: 'REQ003', customerId: 'cust-003', customerName: 'InnoSys Electronics', itemName: 'Battery Pack - UN38.3', itemDescription: 'Transport safety testing for lithium batteries', quantity: 3, priority: 'low', status: 'completed', createdAt: new Date('2023-06-20'), updatedAt: new Date('2023-06-20'), currentStep: 'testing_completed' as ProcessStep },
  { id: 'REQ004', customerId: 'cust-004', customerName: 'EnergyCell Ltd', itemName: 'Battery Charger - IEC62368', itemDescription: 'Battery charger safety evaluation', quantity: 1, priority: 'high', status: 'reviewed', createdAt: new Date('2023-06-22'), updatedAt: new Date('2023-06-22'), currentStep: 'customer_review' as ProcessStep },
];

// Initialize storage with mock data if no data exists
const initializeStorage = () => {
  const existingRequests = localStorage.getItem(STORAGE_KEY);
  if (!existingRequests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRequests));
  }
};

// Call initialization
initializeStorage();

// Get all test requests
export const getAllRequests = (): TestRequest[] => {
  const requestsJson = localStorage.getItem(STORAGE_KEY);
  return requestsJson ? JSON.parse(requestsJson) : [];
};

// Get a request by ID
export const getRequestById = (id: string): TestRequest | undefined => {
  const requests = getAllRequests();
  return requests.find(request => request.id === id);
};

// Generate a new unique ID for requests
const generateRequestId = () => {
  const requests = getAllRequests();
  const lastId = requests.length > 0 
    ? parseInt(requests[requests.length - 1].id.replace('REQ', '')) 
    : 0;
  const newIdNumber = lastId + 1;
  return `REQ${String(newIdNumber).padStart(3, '0')}`;
};

// Add a new test request
export const addRequest = (request: Omit<TestRequest, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'currentStep'>): TestRequest => {
  const requests = getAllRequests();
  
  const newRequest: TestRequest = {
    ...request,
    id: generateRequestId(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    currentStep: 'request_received'
  };
  
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  
  return newRequest;
};

// Update an existing request
export const updateRequest = (updatedRequest: TestRequest): TestRequest => {
  const requests = getAllRequests();
  const index = requests.findIndex(req => req.id === updatedRequest.id);
  
  if (index !== -1) {
    updatedRequest.updatedAt = new Date();
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
  
  return updatedRequest;
};

// Helper function to convert TestRequest to dashboard display format
export const mapRequestToDashboardFormat = (request: TestRequest) => {
  return {
    id: request.id,
    customer: request.customerName,
    item: request.itemName,
    priority: request.priority,
    status: request.status,
    date: request.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    currentStep: request.currentStep
  };
};
