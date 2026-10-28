import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Search,
  Shield,
  BarChart3,
  FileText,
  UserCheck,
  RotateCcw,
  CheckCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDefaultData,
    searchTrackingCode,
    setSearchTrackingCode,
    setSelectedComplaintId,
    complaints,
    openEmailPreview,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchTrackingCode(searchInput.trim().toUpperCase());
    setActiveTab('student-track');
    setSearchInput('');
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'student') {
      setActiveTab('student-submit');
    } else if (role === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (role === 'analytics') {
      setActiveTab('analytics');
    } else if (role === 'evaluator') {
      setActiveTab('evaluation');
    }
  };

  const handleNotificationClick = (notifId: string, trackingCode: string) => {
    markNotificationRead(notifId);
    const matched = complaints.find((c) => c.trackingCode === trackingCode);
    if (matched) {
      setSelectedComplaintId(matched.id);
      setSearchTrackingCode(trackingCode);
      if (currentRole === 'admin') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('student-track');
      }
    }
    setIsNotifOpen(false);
  };

  const handleSimulateEmail = (e: React.MouseEvent, trackingCode: string) => {
    e.stopPropagation();
    const matched = complaints.find((c) => c.trackingCode === trackingCode);
    if (matched) {
      const latestTimeline = matched.timeline[matched.timeline.length - 1];
      openEmailPreview({
        to: matched.isAnonymous ? 'confidential-student@emc.edu.ph' : (matched.email || 'student@emc.edu.ph'),
        recipientName: matched.isAnonymous ? 'Valued Student' : (matched.studentName || 'Student'),
        subject: `Update on Concern ${matched.trackingCode}: ${matched.status}`,
        trackingCode: matched.trackingCode,
        status: matched.status,
        remarks: latestTimeline?.remarks || 'Your complaint status was reviewed by the department.',
        date: latestTimeline?.timestamp || new Date().toISOString(),
      });
      setIsNotifOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Topmost Institution Bar */}
      <div className="bg-slate-900 text-white text-[11px] px-4 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider text-amber-400">EMCI GRIEVANCE SYSTEM</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 hidden sm:inline">Republic of the Philippines · Bongabong, Oriental Mindoro</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <button
            onClick={() => {
              if (window.confirm('Reset all complaint and survey records back to initial demonstration state?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Reset to initial data"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden md:inline">Reset Demo Data</span>
          </button>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400">AY 2026–2027</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Area */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/assets/aistudio/EMC_LOGO_47dc2174.jpg"
            alt="Eastern Mindoro College Official Seal"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full border border-slate-200 bg-white shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Eastern Mindoro College, Inc.
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Student Concern & Complaint Management System
            </p>
          </div>
        </div>

        {/* Center: Quick Tracking Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Track ticket (e.g. EMC-2026-0104)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-xs font-mono pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:font-sans placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right Action Zone: Notifications & Active Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id, n.trackingCode)}
                        className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                          !n.isRead ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 leading-tight">
                            {n.title}
                          </p>
                          <span className="font-mono text-[10px] text-blue-700 shrink-0 font-medium">
                            {n.trackingCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <button
                            onClick={(e) => handleSimulateEmail(e, n.trackingCode)}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
                            title="Preview automated email dispatch"
                          >
                            <span>Email Preview</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Indicator / Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => handleRoleChange('student')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin & Staff
            </button>
            <button
              onClick={() => handleRoleChange('analytics')}
              className={`hidden sm:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                currentRole === 'analytics'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports & Trends
            </button>
            <button
              onClick={() => handleRoleChange('evaluator')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                currentRole === 'evaluator'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="System Acceptability Evaluation (Objective 7)"
            >
              Objective 7 Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-2 gap-4">
          <nav className="flex items-center gap-1 text-xs font-medium text-slate-600">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('student-submit')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'student-submit'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Submit Concern / Complaint
                </button>
                <button
                  onClick={() => setActiveTab('student-track')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'student-track'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Track Concern Status
                </button>
                <button
                  onClick={() => setActiveTab('student-list')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'student-list'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Public Transparency Board
                </button>
                <button
                  onClick={() => setActiveTab('guidelines')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'guidelines'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Grievance Process & Rights
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'admin-dashboard'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Complaints Management Queue
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'analytics'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Institutional Records & Reports
                </button>
              </>
            )}

            {currentRole === 'analytics' && (
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3 py-1 rounded-md bg-white text-blue-900 font-bold shadow-2xs border border-slate-200 whitespace-nowrap shrink-0"
                >
                  Statistical Dashboard & Turnaround SLA
                </button>
                <button
                  onClick={() => setActiveTab('official-memo')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'official-memo'
                      ? 'bg-white text-blue-900 font-bold shadow-2xs border border-slate-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Official Print Memo
                </button>
              </>
            )}

            {currentRole === 'evaluator' && (
              <>
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className="px-3 py-1 rounded-md bg-white text-amber-900 font-bold shadow-2xs border border-amber-200 whitespace-nowrap shrink-0"
                >
                  Objective 7 System Acceptability Instrument
                </button>
                <button
                  onClick={() => setActiveTab('evaluation-stats')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'evaluation-stats'
                      ? 'bg-white text-amber-900 font-bold shadow-2xs border border-amber-200'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Statistical Analysis & Interpretation
                </button>
              </>
            )}
          </nav>

          <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-2 shrink-0">
            <span>System Status:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              Active / Centralized Intake Live
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
