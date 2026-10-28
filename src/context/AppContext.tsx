import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintStatus,
  AssignedDepartment,
  NotificationItem,
  EvaluationSubmission,
  UserRole,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EVALUATIONS,
} from '../data/initialData';

interface EmailPreviewData {
  to: string;
  recipientName: string;
  subject: string;
  trackingCode: string;
  status: ComplaintStatus;
  remarks: string;
  date: string;
}

interface AppContextType {
  complaints: Complaint[];
  notifications: NotificationItem[];
  evaluations: EvaluationSubmission[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  searchTrackingCode: string;
  setSearchTrackingCode: (code: string) => void;
  createComplaint: (
    data: Omit<
      Complaint,
      'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'
    >
  ) => Complaint;
  updateComplaintStatus: (
    id: string,
    newStatus: ComplaintStatus,
    remarks: string,
    actorName: string,
    actorRole: string,
    isInternal?: boolean,
    resolutionSummary?: string
  ) => void;
  assignComplaint: (
    id: string,
    personnel: string,
    department: AssignedDepartment,
    actorName: string
  ) => void;
  submitStudentFeedback: (
    id: string,
    rating: number,
    comment: string
  ) => void;
  submitEvaluation: (
    submission: Omit<EvaluationSubmission, 'id' | 'submittedAt'>
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaultData: () => void;
  emailPreview: EmailPreviewData | null;
  openEmailPreview: (data: EmailPreviewData) => void;
  closeEmailPreview: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'emc_complaints_v2',
  NOTIFICATIONS: 'emc_notifications_v2',
  EVALUATIONS: 'emc_evaluations_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [evaluations, setEvaluations] = useState<EvaluationSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('student-submit');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');
  const [emailPreview, setEmailPreview] = useState<EmailPreviewData | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.warn('Failed to save complaints to localStorage', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Failed to save evaluations to localStorage', e);
    }
  }, [evaluations]);

  const createComplaint = (
    data: Omit<
      Complaint,
      'id' | 'trackingCode' | 'createdAt' | 'updatedAt' | 'timeline' | 'status'
    >
  ): Complaint => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `EMC-2026-${randomNum}`;
    const id = `emc-${Date.now()}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id,
      trackingCode,
      createdAt: now,
      updatedAt: now,
      status: 'Submitted',
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: now,
          status: 'Submitted',
          actionTitle: 'Concern / Complaint Submitted',
          actorName: data.isAnonymous ? 'Anonymous Student' : data.studentName || 'Student',
          actorRole: data.isAnonymous ? 'Student (Anonymous)' : 'Student',
          remarks: 'Ticket successfully filed into the Eastern Mindoro College online grievance queue.',
          isInternal: false,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Create notification for school admin / intake
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      trackingCode,
      title: `New Concern Lodged: ${data.category}`,
      message: `${data.isAnonymous ? 'An anonymous student' : data.studentName} reported: "${data.subject}"`,
      timestamp: now,
      isRead: false,
      targetRole: 'admin',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newComplaint;
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    remarks: string,
    actorName: string,
    actorRole: string,
    isInternal: boolean = false,
    resolutionSummary?: string
  ) => {
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const updatedTimeline = [
          ...c.timeline,
          {
            id: `t-${Date.now()}`,
            timestamp: now,
            status: newStatus,
            actionTitle: `Status set to ${newStatus}`,
            actorName,
            actorRole,
            remarks,
            isInternal,
          },
        ];

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          resolutionSummary: resolutionSummary || c.resolutionSummary,
          resolvedAt: newStatus === 'Resolved' ? now : c.resolvedAt,
          timeline: updatedTimeline,
        };
      })
    );

    // Notify student if email available or in system
    const target = complaints.find((c) => c.id === id);
    if (target && !isInternal) {
      const newNotif: NotificationItem = {
        id: `n-${Date.now()}`,
        trackingCode: target.trackingCode,
        title: `Status Updated: ${newStatus}`,
        message: `${actorName} (${actorRole}) updated ${target.trackingCode}: ${remarks.substring(0, 80)}...`,
        timestamp: now,
        isRead: false,
        targetRole: 'student',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const assignComplaint = (
    id: string,
    personnel: string,
    department: AssignedDepartment,
    actorName: string
  ) => {
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const updatedTimeline = [
          ...c.timeline,
          {
            id: `t-${Date.now()}`,
            timestamp: now,
            status: c.status === 'Submitted' ? 'Under Review' : c.status,
            actionTitle: `Assigned to ${personnel}`,
            actorName,
            actorRole: 'Intake / Department Head',
            remarks: `Endorsed to ${department} for action and investigation.`,
            isInternal: false,
          },
        ];

        return {
          ...c,
          assignedPersonnel: personnel,
          assignedDepartment: department,
          status: c.status === 'Submitted' ? 'Under Review' : c.status,
          updatedAt: now,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const submitStudentFeedback = (id: string, rating: number, comment: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          studentFeedback: {
            rating,
            comment,
            submittedAt: now,
          },
        };
      })
    );
  };

  const submitEvaluation = (
    submission: Omit<EvaluationSubmission, 'id' | 'submittedAt'>
  ) => {
    const newEval: EvaluationSubmission = {
      ...submission,
      id: `eval-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setEvaluations((prev) => [newEval, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetToDefaultData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setEvaluations(INITIAL_EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
  };

  const openEmailPreview = (data: EmailPreviewData) => {
    setEmailPreview(data);
  };

  const closeEmailPreview = () => {
    setEmailPreview(null);
  };

  return (
    <AppContext.Provider
      value={{
        complaints,
        notifications,
        evaluations,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedComplaintId,
        setSelectedComplaintId,
        searchTrackingCode,
        setSearchTrackingCode,
        createComplaint,
        updateComplaintStatus,
        assignComplaint,
        submitStudentFeedback,
        submitEvaluation,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaultData,
        emailPreview,
        openEmailPreview,
        closeEmailPreview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
