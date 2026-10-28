import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Clock,
  UserCheck,
  Building,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Send,
  X,
  Sparkles,
  ArrowUpDown,
  Lock,
} from 'lucide-react';
import {
  Complaint,
  ComplaintStatus,
  AssignedDepartment,
  ComplaintPriority,
  ComplaintCategory,
} from '../types';

export const STAFF_OFFICERS = [
  { name: 'Dr. Evelyn Ramos', role: 'Dean of Student Affairs (OSAS)', dept: 'Office of Student Affairs (OSAS)' },
  { name: 'Engr. Renato Alcala', role: 'Physical Plant Head', dept: 'Physical Plant & Facilities Services' },
  { name: 'Prof. Corazon Navarro', role: 'Dean of Teacher Education', dept: 'Academic Dean & Department Heads' },
  { name: 'Mr. Gabriel Dimaculangan, CPA', role: 'Chief Accountant', dept: 'Accounting & Cashier Office' },
  { name: 'Ms. Arlyn Belen, RGC', role: 'College Guidance Counselor', dept: 'Guidance & Counseling Center' },
  { name: 'Maria Santos, LPT', role: 'Student Intake Coordinator', dept: 'Office of Student Affairs (OSAS)' },
];

export const AdminConsole: React.FC = () => {
  const {
    complaints,
    updateComplaintStatus,
    assignComplaint,
    openEmailPreview,
    setSearchTrackingCode,
    setActiveTab,
  } = useApp();

  // Active Personnel Simulator
  const [activeOfficer, setActiveOfficer] = useState(STAFF_OFFICERS[0]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Selected complaint for resolution action modal
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);

  // Modal Action Form State
  const [modalNewStatus, setModalNewStatus] = useState<ComplaintStatus>('In Investigation');
  const [modalRemarks, setModalRemarks] = useState('');
  const [modalInternalNotes, setModalInternalNotes] = useState('');
  const [modalResolutionSummary, setModalResolutionSummary] = useState('');
  const [modalNewDept, setModalNewDept] = useState<AssignedDepartment>('Office of Student Affairs (OSAS)');
  const [modalNewPersonnel, setModalNewPersonnel] = useState('');

  // Metrics
  const totalComplaints = complaints.length;
  const pendingIntake = complaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = complaints.filter((c) => c.status === 'In Investigation' || c.status === 'Action In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const urgentCount = complaints.filter((c) => (c.priority === 'Urgent' || c.priority === 'High') && c.status !== 'Resolved').length;

  // Filtered List
  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (deptFilter !== 'All' && c.assignedDepartment !== deptFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const matchCode = c.trackingCode.toLowerCase().includes(kw);
      const matchSub = c.subject.toLowerCase().includes(kw);
      const matchDesc = c.description.toLowerCase().includes(kw);
      const matchName = c.studentName?.toLowerCase().includes(kw);
      if (!matchCode && !matchSub && !matchDesc && !matchName) return false;
    }
    return true;
  });

  const handleOpenActionModal = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    setModalNewStatus(complaint.status);
    setModalRemarks('');
    setModalInternalNotes('');
    setModalResolutionSummary(complaint.resolutionSummary || '');
    setModalNewDept(complaint.assignedDepartment);
    setModalNewPersonnel(complaint.assignedPersonnel || activeOfficer.name);
  };

  const handleCloseActionModal = () => {
    setActiveComplaint(null);
  };

  const handleSaveModalAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;

    // 1. Department/Personnel reassignment if changed
    if (
      modalNewDept !== activeComplaint.assignedDepartment ||
      modalNewPersonnel !== activeComplaint.assignedPersonnel
    ) {
      assignComplaint(
        activeComplaint.id,
        modalNewPersonnel,
        modalNewDept,
        activeOfficer.name
      );
    }

    // 2. Status update if changed or remarks added
    const remarksToPost = modalRemarks.trim() || `Status updated to ${modalNewStatus} by ${activeOfficer.name}.`;
    updateComplaintStatus(
      activeComplaint.id,
      modalNewStatus,
      remarksToPost,
      activeOfficer.name,
      activeOfficer.role,
      false,
      modalNewStatus === 'Resolved' ? modalResolutionSummary : undefined
    );

    // 3. Add internal note if provided
    if (modalInternalNotes.trim()) {
      updateComplaintStatus(
        activeComplaint.id,
        modalNewStatus,
        `[INTERNAL COMMITTEE NOTE] ${modalInternalNotes.trim()}`,
        activeOfficer.name,
        activeOfficer.role,
        true
      );
    }

    handleCloseActionModal();
  };

  const handleEmailPreviewForTicket = (c: Complaint) => {
    const latest = c.timeline[c.timeline.length - 1];
    openEmailPreview({
      to: c.isAnonymous ? 'confidential-student@emc.edu.ph' : c.email || 'student@emc.edu.ph',
      recipientName: c.isAnonymous ? 'Valued Student' : c.studentName || 'Student',
      subject: `Official Update on Concern ${c.trackingCode}: ${c.status}`,
      trackingCode: c.trackingCode,
      status: c.status,
      remarks: latest?.remarks || 'Action taken by the responsible Eastern Mindoro College department.',
      date: latest?.timestamp || new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Officer Persona Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Authorized Personnel Console
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-mono">EMCI Grievance Board</span>
            </div>
            <p className="text-sm font-bold text-white">
              Logged in as: <span className="text-blue-300">{activeOfficer.name}</span> ({activeOfficer.role})
            </p>
          </div>
        </div>

        {/* Switch Persona */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Switch Officer View:</span>
          <select
            value={activeOfficer.name}
            onChange={(e) => {
              const matched = STAFF_OFFICERS.find((o) => o.name === e.target.value);
              if (matched) setActiveOfficer(matched);
            }}
            className="bg-slate-800 text-white border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {STAFF_OFFICERS.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name} - {o.dept.split(' ')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Counters (Objective 4 & 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums font-mono">{totalComplaints}</p>
          <span className="text-[11px] text-slate-400">All registered tickets</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Pending Intake</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums font-mono">{pendingIntake}</p>
          <span className="text-[11px] text-slate-400">Needs review & endorsement</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1 tabular-nums font-mono">{inProgress}</p>
          <span className="text-[11px] text-slate-400">Active investigation/action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Resolved</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1 tabular-nums font-mono">{resolved}</p>
          <span className="text-[11px] text-slate-400">
            {totalComplaints > 0 ? `${((resolved / totalComplaints) * 100).toFixed(0)}% resolution rate` : '0%'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">High / Urgent Priority</p>
          <p className="text-2xl font-extrabold text-red-600 mt-1 tabular-nums font-mono">{urgentCount}</p>
          <span className="text-[11px] text-slate-400">Requires swift action</span>
        </div>
      </div>

      {/* Filter and Management Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {['All', 'Submitted', 'Under Review', 'In Investigation', 'Action In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Secondary dropdown filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search keyword or code..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Categories</option>
            <option value="Academics & Grading">Academics & Grading</option>
            <option value="School Facilities & Equipment">Facilities & Equipment</option>
            <option value="Student Affairs & Services">Student Affairs & Services</option>
            <option value="Financial & Cashier">Financial & Cashier</option>
            <option value="Faculty & Staff Conduct">Faculty & Staff Conduct</option>
            <option value="Health & Sanitation">Health & Sanitation</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Departments</option>
            <option value="Office of Student Affairs (OSAS)">Office of Student Affairs</option>
            <option value="Academic Dean & Department Heads">Academic Dean</option>
            <option value="Physical Plant & Facilities Services">Facilities & Physical Plant</option>
            <option value="Accounting & Cashier Office">Accounting & Cashier</option>
            <option value="Guidance & Counseling Center">Guidance & Counseling</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>
        </div>
      </div>

      {/* Complaint Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Complaints Management Queue</h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded-full">
              {filteredComplaints.length} tickets
            </span>
          </div>
          <span className="text-[11px] text-slate-500">Click any row to take action</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Ticket Code</th>
                <th className="py-3 px-4">Complainant / Program</th>
                <th className="py-3 px-4">Subject & Location</th>
                <th className="py-3 px-4">Category & Department</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No complaints matched the selected filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => handleOpenActionModal(c)}
                  >
                    {/* Ticket Code */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {c.trackingCode}
                    </td>

                    {/* Complainant */}
                    <td className="py-3 px-4">
                      {c.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm font-medium text-[11px]">
                          <Lock className="w-2.5 h-2.5" />
                          Anonymous
                        </span>
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-900">{c.studentName}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {c.departmentProgram || 'EMCI Student'}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 line-clamp-1">{c.subject}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.location}
                      </p>
                    </td>

                    {/* Category & Department */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{c.category}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">
                        {c.assignedDepartment.split(' ')[0]}
                      </p>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-sm text-[11px] ${
                          c.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800 font-bold'
                            : c.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : c.priority === 'Medium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2.5 py-0.5 rounded-full ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'Action In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'In Investigation'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-600'
                              : c.status === 'Action In Progress'
                              ? 'bg-amber-600'
                              : 'bg-blue-600'
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenActionModal(c);
                        }}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-[11px] px-3 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        Manage / Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLUTION & ACTION MODAL */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded-sm">
                    {activeComplaint.trackingCode}
                  </span>
                  <span className="text-xs text-slate-300">
                    Logged: {new Date(activeComplaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 leading-tight">
                  {activeComplaint.subject}
                </h3>
              </div>
              <button
                onClick={handleCloseActionModal}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Complainant Profile Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Reporting Student:</span>
                  <p className="font-semibold text-slate-900">
                    {activeComplaint.isAnonymous
                      ? 'Confidential (Anonymous Student Protection)'
                      : `${activeComplaint.studentName} (${activeComplaint.studentId || 'ID on file'})`}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Campus Location:</span>
                  <p className="font-semibold text-slate-900">{activeComplaint.location}</p>
                </div>
              </div>

              {/* Student Narrative */}
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Student's Submitted Narration:
                </span>
                <p className="bg-slate-100/70 p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed text-xs">
                  {activeComplaint.description}
                </p>
              </div>

              {/* Action Form */}
              <form onSubmit={handleSaveModalAction} id="action-form" className="space-y-4 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Selection */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Update Complaint Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={modalNewStatus}
                      onChange={(e) => setModalNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                    >
                      <option value="Submitted">Submitted (Intake)</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Investigation">In Investigation</option>
                      <option value="Action In Progress">Action In Progress</option>
                      <option value="Resolved">Resolved (Complete)</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Assignee / Responsible Person */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Assigned Personnel Handler
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engr. Renato Alcala"
                      value={modalNewPersonnel}
                      onChange={(e) => setModalNewPersonnel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Re-Assign Department */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Responsible Department Unit
                  </label>
                  <select
                    value={modalNewDept}
                    onChange={(e) => setModalNewDept(e.target.value as AssignedDepartment)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Office of Student Affairs (OSAS)">Office of Student Affairs (OSAS)</option>
                    <option value="Academic Dean & Department Heads">Academic Dean & Department Heads</option>
                    <option value="Physical Plant & Facilities Services">Physical Plant & Facilities Services</option>
                    <option value="Accounting & Cashier Office">Accounting & Cashier Office</option>
                    <option value="Registrar & Records Office">Registrar & Records Office</option>
                    <option value="Guidance & Counseling Center">Guidance & Counseling Center</option>
                    <option value="Campus Security & Safety Unit">Campus Security & Safety Unit</option>
                    <option value="General Administration">General Administration</option>
                  </select>
                </div>

                {/* Public Official Remarks for Student */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Official Public Remarks (Visible to Student on Tracking Portal)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter what steps were taken or instructions for the student (e.g. 'Air conditioning compressor replaced; room tested at 23°C')..."
                    value={modalRemarks}
                    onChange={(e) => setModalRemarks(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                {/* Resolution Summary (If marking as Resolved) */}
                {modalNewStatus === 'Resolved' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1">
                    <label className="block font-bold text-emerald-950">
                      Official Institutional Resolution Summary <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[11px] text-emerald-800">
                      This formal summary will be printed on institutional grievance reports and shown to the student body.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Detail the conclusive action, policy intervention, or physical repair executed..."
                      value={modalResolutionSummary}
                      onChange={(e) => setModalResolutionSummary(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none text-xs"
                      required
                    />
                  </div>
                )}

                {/* Internal Committee Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Confidential Internal Committee Notes (Private Audit Trail)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Internal reference notes, administrative cross-checks, or budget requisition codes..."
                    value={modalInternalNotes}
                    onChange={(e) => setModalInternalNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleEmailPreviewForTicket(activeComplaint)}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Simulate Automated Email Dispatch</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseActionModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="action-form"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Status & Remarks</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
