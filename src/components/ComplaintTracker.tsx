import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  Building2,
  Paperclip,
  Star,
  Send,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

const STAGES: ComplaintStatus[] = [
  'Submitted',
  'Under Review',
  'In Investigation',
  'Action In Progress',
  'Resolved',
];

export const ComplaintTracker: React.FC = () => {
  const {
    complaints,
    searchTrackingCode,
    setSearchTrackingCode,
    submitStudentFeedback,
    openEmailPreview,
    setActiveTab,
  } = useApp();

  const [inputCode, setInputCode] = useState(searchTrackingCode || '');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Find active complaint
  const targetCode = searchTrackingCode || inputCode;
  const currentComplaint = complaints.find(
    (c) => c.trackingCode.toLowerCase() === targetCode.trim().toLowerCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSearchTrackingCode(inputCode.trim().toUpperCase());
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComplaint) return;
    submitStudentFeedback(currentComplaint.id, feedbackRating, feedbackComment);
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const getStageIndex = (status: ComplaintStatus) => {
    if (status === 'Closed') return 4;
    return STAGES.indexOf(status);
  };

  const currentStageIndex = currentComplaint ? getStageIndex(currentComplaint.status) : -1;

  const handleEmailPreview = () => {
    if (!currentComplaint) return;
    const latest = currentComplaint.timeline[currentComplaint.timeline.length - 1];
    openEmailPreview({
      to: currentComplaint.isAnonymous
        ? 'confidential-student@emc.edu.ph'
        : currentComplaint.email || 'student@emc.edu.ph',
      recipientName: currentComplaint.isAnonymous
        ? 'Valued Student'
        : currentComplaint.studentName || 'Student',
      subject: `Tracking Update for Concern ${currentComplaint.trackingCode}: ${currentComplaint.status}`,
      trackingCode: currentComplaint.trackingCode,
      status: currentComplaint.status,
      remarks:
        latest?.remarks ||
        currentComplaint.resolutionSummary ||
        'Your concern has been reviewed and logged by Eastern Mindoro College.',
      date: latest?.timestamp || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold">
            <Search className="w-3.5 h-3.5" />
            <span>Real-Time Grievance & Complaint Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Track Status of Your Submitted Concern
          </h2>
          <p className="text-xs text-slate-500">
            Enter the 13-character Reference Code (e.g., <code className="text-blue-700 font-mono">EMC-2026-0104</code>) provided during submission to view chronological actions, investigator remarks, and resolution status.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
            <input
              type="text"
              placeholder="Enter reference code (e.g. EMC-2026-0104)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 font-mono text-sm px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Track Ticket
            </button>
          </form>

          {/* Quick Select Preset Codes for Testing */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="text-[11px]">Quick samples:</span>
            {complaints.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setInputCode(c.trackingCode);
                  setSearchTrackingCode(c.trackingCode);
                }}
                className={`font-mono text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  c.trackingCode === currentComplaint?.trackingCode
                    ? 'bg-blue-700 text-white border-blue-700 font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {c.trackingCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Details View */}
      {currentComplaint ? (
        <div className="space-y-6">
          {/* Main Ticket Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Ticket Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-base font-extrabold text-blue-900 bg-white border border-blue-200 px-3 py-0.5 rounded-md shadow-2xs">
                    {currentComplaint.trackingCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-200/70 px-2.5 py-0.5 rounded-sm">
                    {currentComplaint.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                      currentComplaint.priority === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : currentComplaint.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {currentComplaint.priority} Priority
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {currentComplaint.subject}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleEmailPreview}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
                  title="Preview automated notification dispatch"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Email Dispatch Preview</span>
                </button>
              </div>
            </div>

            {/* 5-Stage Visual Progress Stepper */}
            <div className="p-6 border-b border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Grievance Resolution Lifecycle</span>
                <span className="text-blue-700 normal-case font-semibold">
                  Current Status: {currentComplaint.status}
                </span>
              </div>

              <div className="relative">
                {/* Horizontal line behind circles */}
                <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
                <div
                  className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-0"
                  style={{
                    width: `${(currentStageIndex / (STAGES.length - 1)) * 92}%`,
                  }}
                />

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isPending = idx > currentStageIndex;

                    return (
                      <div
                        key={stage}
                        className={`flex md:flex-col items-center md:text-center gap-3 md:gap-2 p-2.5 rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-blue-50/70 border border-blue-200'
                            : 'bg-transparent'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                            isCompleted
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : isCurrent
                              ? 'bg-blue-700 text-white ring-4 ring-blue-100 shadow-sm'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="text-left md:text-center">
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCurrent
                                ? 'text-blue-900'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {idx === 0 && 'Logged by portal'}
                            {idx === 1 && 'Intake validated'}
                            {idx === 2 && 'Department review'}
                            {idx === 3 && 'Action active'}
                            {idx === 4 && 'Resolution signed'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ticket Metadata Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 text-xs border-b border-slate-200">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Complainant / Reporter:
                </span>
                <p className="font-semibold text-slate-900">
                  {currentComplaint.isAnonymous
                    ? 'Confidential (Anonymous Student)'
                    : currentComplaint.studentName}
                </p>
                {!currentComplaint.isAnonymous && currentComplaint.departmentProgram && (
                  <p className="text-[11px] text-slate-500">
                    {currentComplaint.departmentProgram} · {currentComplaint.yearLevel}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Assigned Department:
                </span>
                <p className="font-semibold text-slate-900">
                  {currentComplaint.assignedDepartment}
                </p>
                {currentComplaint.assignedPersonnel && (
                  <p className="text-[11px] text-blue-700 font-medium">
                    Handler: {currentComplaint.assignedPersonnel}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Campus Location:
                </span>
                <p className="font-semibold text-slate-900">
                  {currentComplaint.location}
                </p>
                <p className="text-[11px] text-slate-500">
                  Date: {currentComplaint.incidentDate}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  SLA Target Turnaround:
                </span>
                <p className="font-semibold text-slate-900">
                  {currentComplaint.targetResolutionDays} School Days
                </p>
                <p className="text-[11px] text-slate-500">
                  Filed: {new Date(currentComplaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Narrative & Desired Resolution */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1.5">
                  Full Statement of Concern
                </h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200/80 leading-relaxed text-sm">
                  {currentComplaint.description}
                </p>
              </div>

              {currentComplaint.desiredResolution && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
                    Student's Desired Outcome / Action Requested
                  </h4>
                  <p className="text-slate-600 bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                    "{currentComplaint.desiredResolution}"
                  </p>
                </div>
              )}

              {/* Attachments */}
              {currentComplaint.attachments.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                    Submitted Evidence & Documents ({currentComplaint.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentComplaint.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-medium text-slate-800">{att.name}</span>
                        <span className="text-slate-400 text-[11px]">({att.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resolution Card if resolved */}
            {currentComplaint.resolutionSummary && (
              <div className="mx-6 mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <FileCheck2 className="w-5 h-5 text-emerald-700" />
                  <span>Official Resolution Summary</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {currentComplaint.resolutionSummary}
                </p>
                <div className="text-[11px] text-emerald-700 pt-1 flex items-center justify-between border-t border-emerald-200/60">
                  <span>Sign-off: {currentComplaint.assignedPersonnel || 'Department Authority'}</span>
                  <span>
                    Resolved on:{' '}
                    {currentComplaint.resolvedAt
                      ? new Date(currentComplaint.resolvedAt).toLocaleString()
                      : 'Recently'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Chronological Official Activity History & Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Chronological Action History & Audit Log
                </h3>
                <p className="text-xs text-slate-500">
                  Official timestamped records showing each intervention step taken by school personnel.
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                {currentComplaint.timeline.length} Recorded Actions
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentComplaint.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-xs ${
                      event.status === 'Resolved'
                        ? 'bg-emerald-600 text-white'
                        : event.status === 'Action In Progress'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    •
                  </div>

                  <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-slate-900 text-sm">
                        {event.actionTitle}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">{event.actorName}</span>
                      <span>·</span>
                      <span className="text-slate-500">{event.actorRole}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-md border border-slate-200/60 leading-relaxed mt-1">
                      {event.remarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Satisfaction & Feedback Survey (If Resolved) */}
          {currentComplaint.status === 'Resolved' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-bold">Student Resolution Satisfaction Feedback</h3>
              </div>
              <p className="text-xs text-slate-600">
                Your evaluation helps Eastern Mindoro College continuously improve academic service quality and administrative responsiveness.
              </p>

              {currentComplaint.studentFeedback ? (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-900">Your Submitted Feedback:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= currentComplaint.studentFeedback!.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 italic">
                    "{currentComplaint.studentFeedback.comment}"
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Logged on {new Date(currentComplaint.studentFeedback.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">How satisfied are you with the resolution?</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= feedbackRating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Provide any comments or suggestions regarding the action taken..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />

                  <div className="flex items-center justify-between">
                    {feedbackSubmitted && (
                      <span className="text-xs text-emerald-600 font-semibold">
                        Thank you! Your feedback has been recorded.
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Resolution Feedback</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Ticket Loaded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please enter a valid tracking code above, or pick one from the quick samples to inspect real-time progress.
          </p>
          <button
            onClick={() => setActiveTab('student-submit')}
            className="text-xs bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
          >
            File a New Concern
          </button>
        </div>
      )}
    </div>
  );
};
