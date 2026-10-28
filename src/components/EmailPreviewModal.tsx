import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, X, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export const EmailPreviewModal: React.FC = () => {
  const { emailPreview, closeEmailPreview, setSearchTrackingCode, setActiveTab } = useApp();

  if (!emailPreview) return null;

  const handleTrackDirectly = () => {
    setSearchTrackingCode(emailPreview.trackingCode);
    setActiveTab('student-track');
    closeEmailPreview();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold tracking-wide">Automated Email Notification Preview</span>
          </div>
          <button
            onClick={closeEmailPreview}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Header Simulation */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 w-16">From:</span>
            <span>Eastern Mindoro College Grievance Portal &lt;grievance@emc.edu.ph&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 w-16">To:</span>
            <span className="font-mono text-slate-900 font-medium">{emailPreview.to}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 w-16">Subject:</span>
            <span className="font-semibold text-slate-900">{emailPreview.subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 w-16">Date:</span>
            <span>{new Date(emailPreview.date).toLocaleString()}</span>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 bg-white">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <img
              src="/assets/aistudio/EMC_LOGO_47dc2174.jpg"
              alt="EMC Seal"
              className="w-11 h-11 object-contain rounded-full shadow-xs border border-slate-200 bg-white"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold text-slate-900 text-base leading-tight">Eastern Mindoro College, Inc.</p>
              <p className="text-xs text-slate-500">Student Concern and Complaint Management System</p>
            </div>
          </div>

          <p>Dear <strong className="text-slate-900">{emailPreview.recipientName || 'Valued Student'}</strong>,</p>

          <p>
            This is an official automated advisory regarding your registered concern at Eastern Mindoro College, Inc.
          </p>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Tracking Reference Number:</span>
              <span className="font-mono font-bold text-blue-900 bg-white px-2.5 py-1 rounded-sm border border-blue-200">
                {emailPreview.trackingCode}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Current Status:</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {emailPreview.status}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-800">Latest Official Action / Personnel Remarks:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 italic leading-relaxed">
              "{emailPreview.remarks}"
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            You may monitor ongoing progress, submit additional clarifications, or inspect the chronological activity log anytime using our web portal.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleTrackDirectly}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <span>View Live Ticket on Web Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Confidential Institutional Advisory
            </span>
            <span>Bongabong, Oriental Mindoro</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeEmailPreview}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
