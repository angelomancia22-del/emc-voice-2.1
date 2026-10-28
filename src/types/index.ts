export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'In Investigation'
  | 'Action In Progress'
  | 'Resolved'
  | 'Closed';

export type ComplaintCategory =
  | 'Academics & Grading'
  | 'School Facilities & Equipment'
  | 'Student Affairs & Services'
  | 'Financial & Cashier'
  | 'Faculty & Staff Conduct'
  | 'Registrar & Student Records'
  | 'Campus Security & Safety'
  | 'Health & Sanitation'
  | 'Other Matters';

export type AssignedDepartment =
  | 'Office of Student Affairs (OSAS)'
  | 'Academic Dean & Department Heads'
  | 'Physical Plant & Facilities Services'
  | 'Accounting & Cashier Office'
  | 'Registrar & Records Office'
  | 'Guidance & Counseling Center'
  | 'Campus Security & Safety Unit'
  | 'General Administration';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ComplaintAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ComplaintTimelineEvent {
  id: string;
  timestamp: string;
  status: ComplaintStatus;
  actionTitle: string;
  actorName: string;
  actorRole: string;
  remarks: string;
  isInternal?: boolean;
}

export interface StudentFeedback {
  rating: number; // 1 to 5
  comment: string;
  submittedAt: string;
}

export interface Complaint {
  id: string;
  trackingCode: string; // e.g. "EMC-2026-0104"
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  studentName?: string;
  studentId?: string;
  departmentProgram?: string; // e.g. "College of Computer Studies (BSIT)"
  yearLevel?: string; // e.g. "3rd Year"
  email?: string;
  phone?: string;
  category: ComplaintCategory;
  assignedDepartment: AssignedDepartment;
  priority: ComplaintPriority;
  subject: string;
  description: string;
  location: string;
  incidentDate: string;
  desiredResolution: string;
  attachments: ComplaintAttachment[];
  status: ComplaintStatus;
  assignedPersonnel?: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  targetResolutionDays: number;
  timeline: ComplaintTimelineEvent[];
  studentFeedback?: StudentFeedback;
}

export interface NotificationItem {
  id: string;
  trackingCode: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetRole: 'student' | 'admin' | 'all';
}

export type UserRole = 'student' | 'admin' | 'analytics' | 'evaluator';

export interface EvaluationItem {
  id: string;
  criterion: 'Functionality' | 'Usability' | 'Reliability' | 'Security';
  statement: string;
}

export interface EvaluationSubmission {
  id: string;
  evaluatorRole: 'Student' | 'Faculty Member' | 'School Administrator' | 'IT / Systems Evaluator';
  ratings: Record<string, number>; // item id -> score 1..5
  comments: string;
  submittedAt: string;
}
