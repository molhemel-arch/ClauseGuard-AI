'use client';

import { useState } from 'react';
import { Shield, Scale, FileText, AlertTriangle, CheckSquare, Copy, Check, FileSearch } from 'lucide-react';

type LegalAnalysisMode = 'risk_audit' | 'plain_english' | 'missing_clauses' | 'obligations';

const MODES: { id: LegalAnalysisMode; label: string; icon: any; desc: string }[] = [
  { id: 'risk_audit', label: 'Risk Audit', icon: Shield, desc: 'Flag liabilities & legal traps' },
  { id: 'plain_english', label: 'Plain English', icon: FileText, desc: 'Translate legalese to plain text' },
  { id: 'missing_clauses', label: 'Missing Clauses', icon: FileSearch, desc: 'Check standard protections' },
  { id: 'obligations', label: 'Obligations', icon: CheckSquare, desc: 'Extract deadlines & terms' },
];

export default function Home() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<LegalAnalysisMode>('risk_audit');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mode }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch {
      setResult('An unexpected error occurred during legal review.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">ClauseGuard AI</h1>
              <p className="text-sm text-slate-400">Automated Contract Intelligence & Risk Assessment Platform</p>
            </div>
          </div>
        </header>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-950/30 text-white shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="font-semibold text-sm">{m.label}</div>
                <div className="text-xs text-slate-500">{m.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Workspace */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Contract / Agreement Text</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste contract clauses, NDA text, service agreement, or terms of service here..."
              className="w-full h-96 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-sm font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-medium rounded-xl text-white transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
            >
              {loading ? (
                <span>Auditing Agreement...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Execute {MODES.find((m) => m.id === mode)?.label}</span>
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Legal Audit Findings</label>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="text-xs flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>
              )}
            </div>
            <div className="w-full h-96 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {result ? (
                result
              ) : (
                <span className="text-slate-600 italic">Audit results will display here following execution...</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
