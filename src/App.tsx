import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StudentPortal } from './components/StudentPortal';
import { ComplaintTracker } from './components/ComplaintTracker';
import { AdminConsole } from './components/AdminConsole';
import { AnalyticsAndReports } from './components/AnalyticsAndReports';
import { EvaluationModule } from './components/EvaluationModule';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { ShieldCheck, Heart, ExternalLink, School, BookOpen } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
      {/* Subtle ambient campus watermark background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/assets/aistudio/emc_d661bd3f.jpg')` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {currentRole === 'student' && (
            <>
              {activeTab === 'student-track' ? (
                <ComplaintTracker />
              ) : (
                <StudentPortal />
              )}
            </>
          )}

          {currentRole === 'admin' && (
            <>
              {activeTab === 'analytics' ? (
                <AnalyticsAndReports />
              ) : (
                <AdminConsole />
              )}
            </>
          )}

          {currentRole === 'analytics' && <AnalyticsAndReports />}

          {currentRole === 'evaluator' && <EvaluationModule />}
        </main>

        {/* Institutional Footer */}
        <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
              {/* Col 1 */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <img
                    src="/assets/aistudio/EMC_LOGO_47dc2174.jpg"
                    alt="EMC Seal"
                    className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <span>Eastern Mindoro College, Inc.</span>
                </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                A premier higher education institution in Oriental Mindoro dedicated to quality instruction, technology-driven administration, and responsive student welfare services.
              </p>
              <p className="text-[11px] text-slate-500">
                Poblacion, Bongabong, Oriental Mindoro 5211 · Contact: osas@emc.edu.ph
              </p>
            </div>

            {/* Col 2 */}
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
                System Quick Access
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  <button
                    onClick={() => setActiveTab('student-submit')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Submit a Concern
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('student-track')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Ticket Tracking
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('student-list')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Public Transparency Board
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('guidelines')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Student Rights & Grievance Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
                Research Compliance
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Developed in compliance with the study on "Web-Based Student Concern and Complaint Management System for Eastern Mindoro College, Inc."
              </p>
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO/IEC 9126 Standards Compliant</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© 2026 Eastern Mindoro College, Inc. All rights reserved.</p>
            <p>Designed for Academic Excellence & Responsive Student Care</p>
          </div>
        </div>
      </footer>

      {/* Global Simulated Email Notification Modal */}
      <EmailPreviewModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
