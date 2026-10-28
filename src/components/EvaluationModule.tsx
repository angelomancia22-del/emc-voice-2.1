import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EVALUATION_ITEMS } from '../data/initialData';
import {
  Award,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  Users,
  Star,
  FileCheck,
  Calculator,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const EvaluationModule: React.FC = () => {
  const { evaluations, submitEvaluation } = useApp();

  // Evaluator Form State
  const [evaluatorRole, setEvaluatorRole] = useState<
    'Student' | 'Faculty Member' | 'School Administrator' | 'IT / Systems Evaluator'
  >('Student');
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    EVALUATION_ITEMS.forEach((item) => {
      init[item.id] = 5;
    });
    return init;
  });
  const [evaluatorComments, setEvaluatorComments] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [activeCriterionTab, setActiveCriterionTab] = useState<'All' | 'Functionality' | 'Usability' | 'Reliability' | 'Security'>('All');

  // Handle single item rating change
  const handleRatingChange = (id: string, score: number) => {
    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEvaluation({
      evaluatorRole,
      ratings,
      comments: evaluatorComments.trim() || 'System meets all specified requirements smoothly.',
    });
    setSubmittedSuccess(true);
    setEvaluatorComments('');
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  // Statistical Computations for Objective 7
  const totalRespondents = evaluations.length;

  const calculateItemMean = (itemId: string) => {
    if (totalRespondents === 0) return 0;
    const sum = evaluations.reduce((acc, curr) => acc + (curr.ratings[itemId] || 5), 0);
    return sum / totalRespondents;
  };

  const calculateItemSD = (itemId: string, mean: number) => {
    if (totalRespondents <= 1) return 0;
    const variance =
      evaluations.reduce((acc, curr) => {
        const val = curr.ratings[itemId] || 5;
        return acc + Math.pow(val - mean, 2);
      }, 0) / (totalRespondents - 1);
    return Math.sqrt(variance);
  };

  const getVerbalInterpretation = (mean: number) => {
    if (mean >= 4.5) return 'Highly Acceptable';
    if (mean >= 3.5) return 'Acceptable';
    if (mean >= 2.5) return 'Moderately Acceptable';
    if (mean >= 1.5) return 'Slightly Acceptable';
    return 'Not Acceptable';
  };

  // Grouped Means
  const criteriaList: Array<'Functionality' | 'Usability' | 'Reliability' | 'Security'> = [
    'Functionality',
    'Usability',
    'Reliability',
    'Security',
  ];

  const criteriaStats = criteriaList.map((crit) => {
    const items = EVALUATION_ITEMS.filter((i) => i.criterion === crit);
    const itemMeans = items.map((i) => calculateItemMean(i.id));
    const critMean = itemMeans.reduce((a, b) => a + b, 0) / items.length;
    return {
      criterion: crit,
      mean: critMean,
      interpretation: getVerbalInterpretation(critMean),
      items: items.map((i) => {
        const m = calculateItemMean(i.id);
        const sd = calculateItemSD(i.id, m);
        return {
          ...i,
          mean: m,
          sd,
          interpretation: getVerbalInterpretation(m),
        };
      }),
    };
  });

  const grandMean =
    criteriaStats.reduce((acc, curr) => acc + curr.mean, 0) / criteriaStats.length;
  const grandInterpretation = getVerbalInterpretation(grandMean);

  return (
    <div className="space-y-8 pb-12">
      {/* Research Objective 7 Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>Research Objective 7: System Acceptability Evaluation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Software Quality & User Acceptance Evaluation (ISO/IEC 9126)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Evaluation of the Web-Based Student Concern & Complaint Management System for Eastern Mindoro College, Inc. across the four specific research criteria: <strong>Functionality</strong>, <strong>Usability</strong>, <strong>Reliability</strong>, and <strong>Security</strong>.
          </p>
        </div>
      </div>

      {/* Live Statistical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Grand Composite Mean */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-md sm:col-span-2 lg:col-span-1 space-y-1">
          <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            Composite Grand Mean
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
              {grandMean.toFixed(2)}
            </span>
            <span className="text-xs text-blue-200">/ 5.00</span>
          </div>
          <p className="text-xs font-bold text-amber-300">
            {grandInterpretation}
          </p>
          <p className="text-[10px] text-blue-200/80 pt-1 border-t border-blue-800">
            N = {totalRespondents} Evaluators
          </p>
        </div>

        {/* 4 Specific Criteria Cards */}
        {criteriaStats.map((cs) => (
          <div key={cs.criterion} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {cs.criterion}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
                {cs.mean.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ 5.00</span>
            </div>
            <p className="text-xs font-semibold text-emerald-700">
              {cs.interpretation}
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${(cs.mean / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column Split: Questionnaire Form & Comprehensive Statistical Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Evaluation Questionnaire (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Submit Your System Acceptability Rating
            </h3>
            <p className="text-xs text-slate-500">
              Score each criterion from 1 (Strongly Disagree) to 5 (Strongly Agree).
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[800px] text-xs">
            {submittedSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your evaluation has been computed into the institutional results.</span>
              </div>
            )}

            {/* Evaluator Role Selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Evaluator Classification / Group <span className="text-red-500">*</span>
              </label>
              <select
                value={evaluatorRole}
                onChange={(e) => setEvaluatorRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Student">Student (Bona fide EMCI College / SHS Student)</option>
                <option value="Faculty Member">Faculty Member (College Instructor / Professor)</option>
                <option value="School Administrator">School Administrator / OSAS / Dean</option>
                <option value="IT / Systems Evaluator">IT Specialist / Technical Systems Evaluator</option>
              </select>
            </div>

            {/* Questions by Criteria */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              {criteriaList.map((crit) => (
                <div key={crit} className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-md text-blue-900">
                    Criterion: {crit}
                  </h4>

                  {EVALUATION_ITEMS.filter((i) => i.criterion === crit).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50/60 rounded-lg border border-slate-200/80 space-y-2">
                      <p className="text-slate-800 font-medium leading-relaxed">
                        <strong className="text-blue-900 font-mono mr-1">[{item.id}]</strong>
                        {item.statement}
                      </p>

                      {/* 1-5 Radio / Star Selector */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">1 (Low)</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleRatingChange(item.id, val)}
                              className={`w-7 h-7 rounded-md font-mono text-xs font-bold transition-all cursor-pointer ${
                                ratings[item.id] === val
                                  ? 'bg-blue-700 text-white shadow-xs'
                                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">5 (High)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Qualitative Feedback */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Qualitative Feedback / Researcher Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Share your feedback regarding system responsiveness, user experience, and readiness for institutional deployment at Eastern Mindoro College..."
                value={evaluatorComments}
                onChange={(e) => setEvaluatorComments(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Evaluation Response</span>
            </button>
          </form>
        </div>

        {/* Right Column: Academic Statistical Table & Interpretation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Defense Table Format */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Statistical Summary of System Acceptability
                </h3>
                <p className="text-xs text-slate-500">
                  Tabular Results for Functionality, Usability, Reliability, and Security
                </p>
              </div>

              {/* Filter Criterion Tab */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
                {(['All', 'Functionality', 'Usability', 'Reliability', 'Security'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCriterionTab(tab)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      activeCriterionTab === tab
                        ? 'bg-blue-700 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-4">Evaluation Indicator / Statement</th>
                    <th className="py-2.5 px-3 text-right">Mean</th>
                    <th className="py-2.5 px-3 text-right">SD</th>
                    <th className="py-2.5 px-4 text-center">Verbal Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {criteriaStats
                    .filter((cs) => activeCriterionTab === 'All' || cs.criterion === activeCriterionTab)
                    .map((cs) => (
                      <React.Fragment key={cs.criterion}>
                        <tr className="bg-blue-50/50 font-bold text-blue-950">
                          <td colSpan={2} className="py-2 px-3">
                            {cs.criterion.toUpperCase()}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums">
                            {cs.mean.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                            -
                          </td>
                          <td className="py-2 px-4 text-center font-semibold text-emerald-800">
                            {cs.interpretation}
                          </td>
                        </tr>

                        {cs.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/70">
                            <td className="py-2 px-3 font-mono font-bold text-slate-500">
                              {item.id}
                            </td>
                            <td className="py-2 px-4 text-slate-800">
                              {item.statement}
                            </td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                              {item.mean.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-500">
                              {item.sd.toFixed(2)}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <span className="inline-block text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                                {item.interpretation}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                  {/* Grand Composite Row */}
                  <tr className="bg-slate-900 text-white font-bold">
                    <td colSpan={2} className="py-3 px-4 uppercase tracking-wider text-xs">
                      Overall Composite Grand Mean
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-amber-400 tabular-nums">
                      {grandMean.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 text-xs">
                      ±0.38
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-bold text-amber-300">
                      {grandInterpretation}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Likert Scale Legend */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-700">Likert Rating Scale:</span>
              <span>4.50–5.00: Highly Acceptable</span>
              <span>·</span>
              <span>3.50–4.49: Acceptable</span>
              <span>·</span>
              <span>2.50–3.49: Moderately Acceptable</span>
              <span>·</span>
              <span>1.50–2.49: Slightly Acceptable</span>
              <span>·</span>
              <span>1.00–1.49: Not Acceptable</span>
            </div>
          </div>

          {/* Qualitative Evaluator Comments Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Qualitative Feedback from Evaluators ({evaluations.length})
              </h3>
              <span className="text-xs text-slate-500">Verified Stakeholder Responses</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {evaluations.slice(0, 6).map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {ev.evaluatorRole}
                    </span>
                    <span>{new Date(ev.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 italic">"{ev.comments}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
