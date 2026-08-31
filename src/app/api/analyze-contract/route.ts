import { NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';

type LegalAnalysisMode = 'risk_audit' | 'plain_english' | 'missing_clauses' | 'obligations';

const SYSTEM_PROMPTS: Record<LegalAnalysisMode, string> = {
  risk_audit: `You are a Senior Corporate Legal Counsel specializing in contract risk management. 
Analyze the provided contract text and highlight:
1. High-Risk Liabilities (e.g., unlimited liability, asymmetric indemnification, aggressive non-competes).
2. Ambiguous Terms that could lead to litigation.
3. Recommended modifications to protect the user.
Use clear headings and severity badges [CRITICAL], [MODERATE], or [LOW].`,

  plain_english: `You are a Legal Tech Communicator. 
Translate the provided legal contract or clause into simple, jargon-free plain English. 
Provide an executive summary followed by a bulleted section explaining what the signee is agreeing to, what rights they keep, and what rights they surrender.`,

  missing_clauses: `You are a Contract Auditor. 
Examine the provided legal document and identify standard protective clauses that are MISSING or INSUFFICIENT (e.g., Dispute Resolution, Force Majeure, IP Assignment, Severability, Mutual Termination for Cause). 
Explain why each missing clause poses an operational risk.`,

  obligations: `You are a Legal Operations Specialist. 
Extract all actionable commitments, payment triggers, notice periods, renewal deadlines, and performance obligations from the contract text into a chronological checklist.`
};

export async function POST(req: Request) {
  try {
    const { content, mode }: { content: string; mode: LegalAnalysisMode } = await req.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Contract text is required.' }, { status: 400 });
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.risk_audit;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the following legal document content:\n\n${content}`
        }
      ]
    });

    const output = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      result: output,
      usage: response.usage
    });
  } catch (error: any) {
    console.error('Legal AI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete legal analysis.' },
      { status: 500 }
    );
  }
}
