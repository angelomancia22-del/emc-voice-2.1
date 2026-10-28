import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Send,
  Upload,
  AlertCircle,
  Copy,
  CheckCircle2,
  Lock,
  User,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
  FileQuestion,
  HelpCircle,
  School,
  Building2,
  Calendar,
  MapPin,
  Paperclip,
} from 'lucide-react';
import {
  ComplaintCategory,
  AssignedDepartment,
  ComplaintPriority,
  ComplaintAttachment,
} from '../types';

export const StudentPortal: React.FC = () => {
  const {
    createComplaint,
    complaints,
    activeTab,
    setActiveTab,
    setSearchTrackingCode,
    setSelectedComplaintId,
    openEmailPreview,
  } = useApp();

  // Submission Form State
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [departmentProgram, setDepartmentProgram] = useState('College of Computer Studies (BSIT)');
  const [yearLevel, setYearLevel] = useState('3rd Year');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [category, setCategory] = useState<ComplaintCategory>('School Facilities & Equipment');
  const [assignedDepartment, setAssignedDepartment] = useState<AssignedDepartment>(
    'Physical Plant & Facilities Services'
  );
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [desiredResolution, setDesiredResolution] = useState('');
  const [attachments, setAttachments] = useState<ComplaintAttachment[]>([]);
  const [fileNameInput, setFileNameInput] = useState('');

  // Submission Result Modal
  const [createdTicketCode, setCreatedTicketCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-map category to suggested department
  const handleCategoryChange = (newCat: ComplaintCategory) => {
    setCategory(newCat);
    if (newCat === 'Academics & Grading') {
      setAssignedDepartment('Academic Dean & Department Heads');
    } else if (newCat === 'School Facilities & Equipment' || newCat === 'Health & Sanitation') {
      setAssignedDepartment('Physical Plant & Facilities Services');
    } else if (newCat === 'Financial & Cashier') {
      setAssignedDepartment('Accounting & Cashier Office');
    } else if (newCat === 'Registrar & Student Records') {
      setAssignedDepartment('Registrar & Records Office');
    } else if (newCat === 'Student Affairs & Services') {
      setAssignedDepartment('Office of Student Affairs (OSAS)');
    } else if (newCat === 'Campus Security & Safety') {
      setAssignedDepartment('Campus Security & Safety Unit');
    }
  };

  const handleAddSimulatedFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileNameInput.trim()) return;
    const name = fileNameInput.trim();
    const isImg = name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg');
    const newAtt: ComplaintAttachment = {
      name,
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
      type: isImg ? 'image/jpeg' : 'application/pdf',
    };
    setAttachments((prev) => [...prev, newAtt]);
    setFileNameInput('');
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!subject.trim()) {
      setFormError('Please provide a specific subject title for your concern.');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setFormError('Please enter a thorough description of your concern (minimum 20 characters).');
      return;
    }
    if (!location.trim()) {
      setFormError('Please specify the campus location where the issue occurred or relates to.');
      return;
    }
    if (!isAnonymous && !studentName.trim()) {
      setFormError('Please provide your name or switch to Anonymous mode.');
      return;
    }

    const newTicket = createComplaint({
      isAnonymous,
      studentName: isAnonymous ? 'Anonymous Student' : studentName,
      studentId: isAnonymous ? undefined : studentId,
      departmentProgram,
      yearLevel,
      email: isAnonymous ? undefined : email,
      phone: isAnonymous ? undefined : phone,
      category,
      assignedDepartment,
      priority,
      subject,
      description,
      location,
      incidentDate,
      desiredResolution,
      attachments,
      targetResolutionDays: priority === 'Urgent' ? 2 : priority === 'High' ? 3 : 5,
    });

    setCreatedTicketCode(newTicket.trackingCode);

    // Reset form fields
    setSubject('');
    setDescription('');
    setLocation('');
    setDesiredResolution('');
    setAttachments([]);
  };

  const copyToClipboard = () => {
    if (!createdTicketCode) return;
    navigator.clipboard.writeText(createdTicketCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTrackCreatedTicket = () => {
    if (!createdTicketCode) return;
    setSearchTrackingCode(createdTicketCode);
    setActiveTab('student-track');
    setCreatedTicketCode(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner with Real EMC Campus Background */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 text-white min-h-[280px] sm:min-h-[320px] flex items-center">
        {/* Real Campus Photo Background */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/assets/aistudio/emc_d661bd3f.jpg"
            alt="Eastern Mindoro College Campus - Dr. Angel Rodriguez Hall and I Love EMC Landmark"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* High-legibility gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-slate-900/70" />
        </div>

        <div className="relative p-6 sm:p-8 md:p-10 z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/aistudio/EMC_LOGO_47dc2174.jpg"
              alt="EMC Seal"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 shadow-md border border-amber-400"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL STUDENT GRIEVANCE & CONCERN PORTAL · EST. 1945</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 drop-shadow-xs">
            Your Voice Matters at Eastern Mindoro College
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-6 max-w-2xl">
            A centralized, accessible platform for EMCI students to report academic issues, school facilities, cashier transactions, and student welfare concerns. Monitored continuously by the Office of Student Affairs & Services.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('student-submit')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Submit a Concern Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('student-track')}
              className="bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/30 px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer font-semibold"
            >
              <span>Track Existing Ticket</span>
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Guarantees Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Confidential & Anonymous</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Report sensitive matters without disclosing your identity. The system guarantees student protection under institutional anti-retaliation policies.
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Guaranteed SLA Turnaround</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every submission is time-stamped and bound to target resolution timelines (2 to 5 school days) monitored directly by the Office of Student Affairs.
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">End-to-End Tracking</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Obtain an instant Reference Number (e.g. EMC-2026-XXXX). Inspect official personnel action notes, investigation logs, and resolutions in real-time.
          </p>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'student-submit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Concern & Complaint Intake Form</h3>
              <p className="text-xs text-slate-500">
                Please provide accurate details so the responsible EMC department can investigate promptly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Anonymous Mode:</span>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isAnonymous ? 'bg-blue-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Anonymous notice banner if active */}
            {isAnonymous ? (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Anonymous Reporting Protocol Engaged</p>
                  <p className="text-amber-800/90 mt-0.5 leading-relaxed">
                    Your name, student ID, and personal contacts will not be recorded or visible to department personnel. Please ensure you keep your Reference Code safely to check on progress later.
                  </p>
                </div>
              </div>
            ) : (
              /* Student Profile Details */
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Student Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Full Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Juan Dela Cruz"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Student ID Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024-0192"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">College Program / Strand</label>
                    <select
                      value={departmentProgram}
                      onChange={(e) => setDepartmentProgram(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="College of Computer Studies (BSIT)">College of Computer Studies (BSIT)</option>
                      <option value="College of Education (BSED English/Math/SocSci)">College of Education (BSED)</option>
                      <option value="College of Education (BEED General)">College of Education (BEED)</option>
                      <option value="College of Business Administration (BSBA)">College of Business Administration (BSBA)</option>
                      <option value="College of Arts and Sciences (AB PolSci/Comm)">College of Arts and Sciences</option>
                      <option value="College of Criminology (BS Criminology)">College of Criminology</option>
                      <option value="Senior High School (STEM)">Senior High School (STEM)</option>
                      <option value="Senior High School (ABM)">Senior High School (ABM)</option>
                      <option value="Senior High School (HUMSS)">Senior High School (HUMSS)</option>
                      <option value="Senior High School (TVL / ICT)">Senior High School (TVL / ICT)</option>
                      <option value="Basic Education / Junior High">Basic Education / Junior High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Year Level</label>
                    <select
                      value={yearLevel}
                      onChange={(e) => setYearLevel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="Alumni / Returning">Alumni / Returning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="student@emc.edu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Contact Mobile Number</label>
                    <input
                      type="text"
                      placeholder="0917-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Concern Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Concern Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Academics & Grading">Academics & Grading</option>
                  <option value="School Facilities & Equipment">School Facilities & Equipment</option>
                  <option value="Student Affairs & Services">Student Affairs & Services</option>
                  <option value="Financial & Cashier">Financial & Cashier</option>
                  <option value="Faculty & Staff Conduct">Faculty & Staff Conduct</option>
                  <option value="Registrar & Student Records">Registrar & Student Records</option>
                  <option value="Campus Security & Safety">Campus Security & Safety</option>
                  <option value="Health & Sanitation">Health & Sanitation</option>
                  <option value="Other Matters">Other Matters</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Responsible Department / Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value as AssignedDepartment)}
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

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Urgency / Priority Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Low">Low (General suggestion or routine inquiry)</option>
                  <option value="Medium">Medium (Moderate impact on daily activity)</option>
                  <option value="High">High (Impacting classes, grades, or facilities)</option>
                  <option value="Urgent">Urgent (Safety hazard, critical disruption, time-sensitive)</option>
                </select>
              </div>
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Campus Location / Building / Room <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Computer Laboratory 2, Main Bldg 2nd Floor"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Incident / Observation Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Subject Title */}
            <div className="text-xs">
              <label className="block font-semibold text-slate-800 mb-1">
                Subject Title of Concern <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Air Conditioning Failure in Computer Laboratory 2 during 3rd Year BSIT class"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              />
            </div>

            {/* Detailed Description */}
            <div className="text-xs">
              <label className="block font-semibold text-slate-800 mb-1">
                Detailed Narration / Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Kindly describe clearly what happened, who was affected, and any specific times or recurring occurrences..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Desired Resolution */}
            <div className="text-xs">
              <label className="block font-semibold text-slate-800 mb-1">
                Desired Outcome / Suggested Resolution (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Inspection and electrical servicing of air conditioning units before next week"
                value={desiredResolution}
                onChange={(e) => setDesiredResolution(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Simulated Attachment Upload */}
            <div className="text-xs space-y-2">
              <label className="block font-semibold text-slate-800">
                Supporting Evidence / Attachments (Optional photographs, clearance slips, receipts)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Simulate uploading a file (e.g., photo_evidence.jpg or receipt.pdf)"
                  value={fileNameInput}
                  onChange={(e) => setFileNameInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSimulatedFile}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Attach</span>
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11px]"
                    >
                      <Paperclip className="w-3 h-3 text-slate-500" />
                      <span className="font-medium text-slate-700">{att.name}</span>
                      <span className="text-slate-400">({att.size})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Declaration & Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500 max-w-lg leading-tight">
                By submitting, you certify that this concern is lodged in good faith pursuant to Eastern Mindoro College Student Manual & Grievance Guidelines.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance / Concern</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Public Transparency Board Tab */}
      {activeTab === 'student-list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">EMCI Public Transparency & Grievance Board</h3>
              <p className="text-xs text-slate-500">
                Live institutional log showing submitted concerns and actions taken across departments. Student identities remain protected.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('student-submit')}
              className="text-xs bg-blue-700 hover:bg-blue-800 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              + File New Concern
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                      {c.trackingCode}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">{c.category}</span>
                    <span>·</span>
                    <span>{c.assignedDepartment}</span>
                    <span>·</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
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
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{c.subject}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {c.description}
                </p>

                {c.resolutionSummary && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-lg p-2.5 text-xs text-emerald-900 mb-3">
                    <strong>Official Resolution:</strong> {c.resolutionSummary}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {c.location}
                  </span>
                  <button
                    onClick={() => {
                      setSearchTrackingCode(c.trackingCode);
                      setActiveTab('student-track');
                    }}
                    className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Timeline & Updates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Eastern Mindoro College Student Grievance & Complaint Policy
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Guidelines adopted by the Board of Trustees and Office of Student Affairs (OSAS)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-blue-700" />
                1. Institutional Commitment & Rights
              </h4>
              <p>
                Every bona fide student of Eastern Mindoro College, Inc. possesses the right to safe, respectful, and conducive learning conditions. The College strictly enforces a Zero-Retaliation Guarantee: no student shall face academic penalty, hostility, or harassment as a result of filing a legitimate grievance or concern.
              </p>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pt-2">
                <Lock className="w-4 h-4 text-blue-700" />
                2. Privacy and Anonymity
              </h4>
              <p>
                Students who prefer complete confidentiality may select the Anonymous mode. However, providing your contact details allows the investigating committee to contact you for supporting evidence if necessary.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                3. Standard Operational Workflow & SLA
              </h4>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Stage 1 (Submitted):</strong> Intake officer verifies completeness within 24 hours.</li>
                <li><strong>Stage 2 (Under Review):</strong> Assigned to the relevant College Dean or Department Head.</li>
                <li><strong>Stage 3 (In Investigation):</strong> Dialogue, facility testing, or grade record cross-checks conducted.</li>
                <li><strong>Stage 4 (Action In Progress):</strong> Concrete physical or administrative intervention deployed.</li>
                <li><strong>Stage 5 (Resolved):</strong> Resolution report posted; student feedback collected.</li>
              </ul>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 mt-2">
                <strong>Emergency Inquiries:</strong> For acute campus safety threats, immediately alert the Campus Security Office or OSAS hotline at (043) 283-5000.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL AFTER SUBMISSION */}
      {createdTicketCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Concern Successfully Filed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your ticket has been logged into the Eastern Mindoro College grievance queue.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Your Tracking Reference Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-extrabold text-blue-900 tracking-wider">
                  {createdTicketCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 text-slate-500 hover:text-blue-700 bg-white border border-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Copy reference code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copiedCode && (
                <p className="text-[11px] font-semibold text-emerald-600">Copied to clipboard!</p>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Save this reference number. You can use it to track real-time inspection, progress notes, and resolution actions taken by school personnel.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleTrackCreatedTicket}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track This Ticket Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCreatedTicketCode(null)}
                className="w-full text-slate-600 hover:text-slate-900 text-xs py-2 font-medium cursor-pointer"
              >
                Back to Home Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
