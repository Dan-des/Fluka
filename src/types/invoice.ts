export type InvoiceMode = 'invoice' | 'receipt';

export type WatermarkType = 'none' | 'PAID' | 'DRAFT' | 'PENDING' | 'OVERDUE' | 'ORIGINAL';

export type TemplateStyle = 'modern' | 'classic' | 'minimal' | 'bold';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'before' | 'after';
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxId: string;
  logoUrl?: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  paymentTerms: string;
  notes: string;
}

export interface InvoiceData {
  mode: InvoiceMode;
  number: string;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  currency: string;
  accentColor: string;
  templateStyle: TemplateStyle;
  watermark: WatermarkType;
  business: BusinessInfo;
  client: ClientInfo;
  items: LineItem[];
  taxRate: number; // percentage
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  shipping: number;
  amountPaid: number;
  paymentDetails: PaymentDetails;
}

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', position: 'before' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', position: 'before' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', position: 'before' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', position: 'before' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', position: 'before' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', position: 'before' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', position: 'before' },
  CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc (CHF)', position: 'before' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', position: 'before' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', position: 'before' },
};

export const COLOR_PRESETS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Ocean Blue', hex: '#0284c7' },
  { name: 'Violet Glow', hex: '#7c3aed' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Slate Dark', hex: '#334155' },
  { name: 'Rose Pink', hex: '#e11d48' },
];

export const SAMPLE_PRESETS: Record<string, { label: string; data: Partial<InvoiceData> }> = {
  web_design: {
    label: '💻 Web Development Project',
    data: {
      mode: 'invoice',
      number: 'INV-2026-089',
      issueDate: '2026-07-23',
      dueDate: '2026-08-07',
      currency: 'USD',
      accentColor: '#4f46e5',
      templateStyle: 'modern',
      watermark: 'none',
      business: {
        name: 'Apex Design Co.',
        email: 'billing@apexdesign.io',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace, Suite 400\nSan Francisco, CA 94107',
        website: 'https://apexdesign.io',
        taxId: 'US-987654321',
      },
      client: {
        name: 'Sarah Jenkins',
        company: 'CloudScale Technologies',
        email: 's.jenkins@cloudscale.app',
        phone: '+1 (555) 987-6543',
        address: '100 Innovation Way, Floor 12\nAustin, TX 78701',
        taxId: 'US-123456789',
      },
      items: [
        {
          id: '1',
          description: 'UI/UX Mobile & Web App Redesign (Figma Prototypes)',
          quantity: 1,
          unitPrice: 3500.0,
        },
        {
          id: '2',
          description: 'Frontend Development (React, TypeScript, Tailwind CSS)',
          quantity: 40,
          unitPrice: 95.0,
        },
        {
          id: '3',
          description: 'REST API & Supabase Database Architecture',
          quantity: 15,
          unitPrice: 110.0,
        },
        {
          id: '4',
          description: 'Deployment, CI/CD Pipeline & Quality Assurance',
          quantity: 1,
          unitPrice: 850.0,
        },
      ],
      taxRate: 8.5,
      discountType: 'percentage',
      discountValue: 5,
      shipping: 0,
      amountPaid: 0,
      paymentDetails: {
        bankName: 'Silicon Valley Bank / First Republic',
        accountName: 'Apex Design Co. LLC',
        accountNumber: 'XXXX-XXXX-4829',
        routingNumber: '121000358',
        swiftBic: 'SVBKUS6S',
        paymentTerms: 'Payment due within 15 days of invoice date. Late payments subject to a 1.5% monthly fee.',
        notes: 'Thank you for choosing Apex Design Co.! We appreciate your business.',
      },
    },
  },
  receipt_saas: {
    label: '🧾 SaaS Annual Subscription Receipt',
    data: {
      mode: 'receipt',
      number: 'REC-2026-4402',
      issueDate: '2026-07-23',
      dueDate: '2026-07-23',
      paymentDate: '2026-07-23',
      paymentMethod: 'Credit Card (Visa ending in 9041)',
      transactionId: 'TXN-99841029381',
      currency: 'USD',
      accentColor: '#059669',
      templateStyle: 'classic',
      watermark: 'PAID',
      business: {
        name: 'Nexus Cloud Systems Inc.',
        email: 'support@nexuscloud.com',
        phone: '+1 (800) 555-0199',
        address: '500 Tech Plaza, Suite 2000\nSeattle, WA 98101',
        website: 'https://nexuscloud.com',
        taxId: 'EIN-90-8812341',
      },
      client: {
        name: 'Marcus Vance',
        company: 'Vance Capital Partners',
        email: 'marcus@vancecap.com',
        phone: '+1 (555) 345-6789',
        address: '45 Wall Street, 18th Floor\nNew York, NY 10005',
        taxId: 'US-884910293',
      },
      items: [
        {
          id: '1',
          description: 'Enterprise Enterprise Plan - Annual Billing (25 Seats)',
          quantity: 1,
          unitPrice: 2400.0,
        },
        {
          id: '2',
          description: 'Dedicated Priority Support Add-on (12 Months)',
          quantity: 1,
          unitPrice: 600.0,
        },
        {
          id: '3',
          description: 'Custom Domain & SSO Authentication Module',
          quantity: 1,
          unitPrice: 300.0,
        },
      ],
      taxRate: 10.0,
      discountType: 'fixed',
      discountValue: 300,
      shipping: 0,
      amountPaid: 3300.0,
      paymentDetails: {
        bankName: 'JPMorgan Chase Bank',
        accountName: 'Nexus Cloud Systems Inc',
        accountNumber: 'XXXX-XXXX-9912',
        routingNumber: '021000021',
        swiftBic: 'CHASUS33',
        paymentTerms: 'Paid in full via Stripe Payments.',
        notes: 'This document serves as an official receipt of payment for service rendered.',
      },
    },
  },
  freelance_consulting: {
    label: '💼 Strategy & Marketing Consulting',
    data: {
      mode: 'invoice',
      number: 'INV-2026-104',
      issueDate: '2026-07-20',
      dueDate: '2026-08-03',
      currency: 'EUR',
      accentColor: '#7c3aed',
      templateStyle: 'minimal',
      watermark: 'none',
      business: {
        name: 'Vanguard Strategy Studio',
        email: 'hello@vanguardstrategy.eu',
        phone: '+44 20 7946 0912',
        address: '25 Finsbury Circus\nLondon, EC2M 7EE, UK',
        website: 'https://vanguardstrategy.eu',
        taxId: 'GB-991238471',
      },
      client: {
        name: 'Elena Rostova',
        company: 'Nordic Growth Labs',
        email: 'elena@nordicgrowth.se',
        phone: '+46 8 123 4567',
        address: 'Kungsgatan 44\n111 35 Stockholm, Sweden',
        taxId: 'SE-556123456701',
      },
      items: [
        {
          id: '1',
          description: 'Q3 Brand Positioning Strategy & Market Research Analysis',
          quantity: 1,
          unitPrice: 1800.0,
        },
        {
          id: '2',
          description: 'Executive Advisory Workshops (4 sessions x 2 hrs)',
          quantity: 8,
          unitPrice: 150.0,
        },
        {
          id: '3',
          description: 'Go-to-Market Playbook & Marketing Funnel Blueprint',
          quantity: 1,
          unitPrice: 1200.0,
        },
      ],
      taxRate: 20.0,
      discountType: 'percentage',
      discountValue: 0,
      shipping: 0,
      amountPaid: 0,
      paymentDetails: {
        bankName: 'Barclays Bank UK',
        accountName: 'Vanguard Strategy Studio Ltd',
        accountNumber: '88392019',
        routingNumber: '20-00-00',
        swiftBic: 'BARCGB22',
        paymentTerms: 'Payment due within 14 calendar days. Please reference invoice INV-2026-104.',
        notes: 'Thank you for partnering with Vanguard Strategy Studio!',
      },
    },
  },
};
