
import { ProductQuote, QuoteItem } from '@/types';

// Generate unique IDs for items
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock quote items
const mockQuoteItems: QuoteItem[] = [
  {
    id: generateId(),
    name: 'Material Strength Testing',
    description: 'Comprehensive tensile and compression testing for construction materials',
    unitPrice: 1200,
    quantity: 1,
    total: 1200
  },
  {
    id: generateId(),
    name: 'Chemical Analysis Package',
    description: 'Full spectrum analysis of material composition',
    unitPrice: 850,
    quantity: 2,
    discount: 10,
    total: 1530
  },
  {
    id: generateId(),
    name: 'Durability Assessment',
    description: 'Environmental exposure and aging simulation tests',
    unitPrice: 1500,
    quantity: 1,
    total: 1500
  }
];

// Mock quotes
export const mockQuotes: ProductQuote[] = [
  {
    id: 'QT-2023-001',
    customerId: 'customer-1',
    customerName: 'Acme Construction',
    customerEmail: 'contact@acmeconstruction.com',
    items: mockQuoteItems,
    subtotal: 4230,
    discountTotal: 170,
    tax: 406,
    total: 4466,
    status: 'sent',
    notes: 'Quote valid for 30 days. Testing will begin within 5 business days of acceptance.',
    validUntil: new Date('2023-12-31'),
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2023-11-15'),
    createdBy: 'sales-1'
  },
  {
    id: 'QT-2023-002',
    customerId: 'customer-2',
    customerName: 'BuildRight Materials',
    customerEmail: 'procurement@buildright.com',
    items: [mockQuoteItems[0], mockQuoteItems[2]],
    subtotal: 2700,
    tax: 270,
    total: 2970,
    status: 'accepted',
    validUntil: new Date('2023-12-15'),
    createdAt: new Date('2023-10-30'),
    updatedAt: new Date('2023-11-02'),
    createdBy: 'sales-1'
  },
  {
    id: 'QT-2023-003',
    customerId: 'customer-3',
    customerName: 'EcoSustain Products',
    customerEmail: 'lab@ecosustain.org',
    items: [
      {
        id: generateId(),
        name: 'Environmental Compliance Testing',
        description: 'Testing for eco-certification standards',
        unitPrice: 2200,
        quantity: 1,
        total: 2200
      },
      {
        id: generateId(),
        name: 'Biodegradability Analysis',
        description: 'Complete breakdown and decomposition analysis',
        unitPrice: 1800,
        quantity: 1,
        discount: 15,
        total: 1530
      }
    ],
    subtotal: 3730,
    discountTotal: 270,
    tax: 346,
    total: 3806,
    status: 'draft',
    notes: 'Special handling required for organic materials.',
    validUntil: new Date('2024-01-15'),
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
    createdBy: 'sales-1'
  },
  {
    id: 'QT-2023-004',
    customerId: 'customer-1',
    customerName: 'Acme Construction',
    customerEmail: 'contact@acmeconstruction.com',
    items: [
      {
        id: generateId(),
        name: 'Structural Integrity Testing',
        description: 'Load-bearing tests for structural components',
        unitPrice: 3200,
        quantity: 1,
        total: 3200
      }
    ],
    subtotal: 3200,
    tax: 320,
    total: 3520,
    status: 'viewed',
    validUntil: new Date('2023-12-25'),
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-07'),
    createdBy: 'sales-1'
  },
  {
    id: 'QT-2023-005',
    customerId: 'customer-4',
    customerName: 'Innovative Materials Inc',
    customerEmail: 'research@innomaterials.com',
    items: [
      {
        id: generateId(),
        name: 'Advanced Polymer Testing',
        description: 'Comprehensive analysis of new polymer formulations',
        unitPrice: 4500,
        quantity: 1,
        total: 4500
      },
      {
        id: generateId(),
        name: 'Thermal Stability Assessment',
        description: 'Temperature resistance and reaction testing',
        unitPrice: 2800,
        quantity: 1,
        total: 2800
      }
    ],
    subtotal: 7300,
    discountTotal: 500,
    tax: 680,
    total: 7480,
    status: 'expired',
    validUntil: new Date('2023-10-31'),
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15'),
    createdBy: 'sales-1'
  }
];

// Get a quote by ID
export function getQuoteById(id: string): ProductQuote | undefined {
  return mockQuotes.find(quote => quote.id === id);
}

// Get all quotes for a customer
export function getQuotesByCustomer(customerId: string): ProductQuote[] {
  return mockQuotes.filter(quote => quote.customerId === customerId);
}
