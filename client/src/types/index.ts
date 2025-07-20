export interface DashboardStats {
  activeClients: number;
  products: number;
  fmeaActive: number;
  controlPlans: number;
}

export interface Activity {
  id: string;
  type: 'edit' | 'create' | 'approve' | 'warning';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export interface DocumentStatus {
  approved: number;
  inReview: number;
  draft: number;
  expired: number;
}

export interface ProjectSummary {
  id: number;
  clientName: string;
  clientCode: string;
  productName: string;
  productCode: string;
  currentVersion: string;
  versionDate: string;
  responsible: string;
  fmeaStatus: 'approved' | 'in-progress' | 'expired' | 'draft';
  controlPlanStatus: 'approved' | 'in-review' | 'draft' | 'not-started';
}
