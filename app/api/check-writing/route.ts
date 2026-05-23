// /app/api/check-writing/route.ts
// Next.js 13+ App Router API route
// Place your OPENAI_API_KEY in .env.local — never in frontend code.

import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface ImprovementItem {
  point: string;
  before: string;
  after: string;
}

interface PartFeedback {
  taskAchievement?: number;  // Task 1
  taskResponse?: number;     // Task 2
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  strengths: string[];
  improvements: ImprovementItem[];
}

interface FeedbackResult {
  overall: number;
  overallDescriptor: string;
  part1: PartFeedback;
  part2: PartFeedback;
}

// ---------------------------------------------------------------------------
// TASK DEFINITIONS
// Each test ID maps to its prompts AND, for Task 1, a full text description
// of the chart/diagram so the AI can assess accurately without seeing the image.
// ---------------------------------------------------------------------------

interface TaskDefinition {
  type: "task1" | "task2";
  promptText: string;           // The instruction shown to the candidate
  chartDescription?: string;    // Task 1 only: complete data description for AI
}

interface TestDefinition {
  task1: TaskDefinition;
  task2: TaskDefinition;
}

// Add all your tests here. The key is the testId sent from the frontend.
const TEST_LIBRARY: Record<string, TestDefinition> = {

  // -----------------------------------------------------------------------
  // TEST 1 — Sports participation bar chart
  // -----------------------------------------------------------------------
  "writing-test-1": {
    task1: {
      type: "task1",
      promptText:
        "The chart below shows the number of adults participating in different major sports in one area, in 1997 and 2017. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      chartDescription: `
CHART TYPE: Grouped bar chart (two bars per sport — one for 1997, one for 2017)
UNIT: Number of adult participants (thousands)
TIME POINTS: 1997 and 2017

DATA (approximate values from chart):

| Sport       | 1997  | 2017  | Change        |
|-------------|-------|-------|---------------|
| Swimming    | 50,000 | 30,000 | ↓ fell by 20,000 (~40% decrease) |
| Football    | 45,000 | 50,000 | ↑ rose by 5,000 (~11% increase) |
| Tennis      | 35,000 | 20,000 | ↓ fell by 15,000 (~43% decrease) |
| Cycling     | 25,000 | 60,000 | ↑ rose by 35,000 (~140% increase — the largest growth) |
| Golf        | 30,000 | 22,000 | ↓ fell slightly by 8,000 (~27% decrease) |
| Running     | 20,000 | 55,000 | ↑ rose by 35,000 (~175% increase — the biggest relative growth) |

KEY FEATURES THE EXAMINER SHOULD LOOK FOR IN THE ESSAY:
1. Overview: two sports declined (swimming, tennis), three grew significantly (cycling, running, football), golf fell slightly.
2. Most notable trend: cycling and running both saw dramatic increases and became the two most popular sports by 2017.
3. Swimming was the most popular sport in 1997 but fell significantly by 2017.
4. Tennis declined substantially (from 3rd to among the lowest).
5. Football remained relatively stable with a modest increase.
6. Running had the highest percentage growth overall.
7. By 2017, running and cycling overtook swimming as the most participated sports.

The candidate's essay should report specific figures, give an overview, and compare trends — not just list numbers.
      `.trim(),
    },
    task2: {
      type: "task2",
      promptText:
        "The world of work is changing rapidly and employees cannot depend on having the same job or the same working conditions for life. Discuss the possible causes for this rapid change, and suggest ways of preparing people for the world of work in the future. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    },
  },

  // -----------------------------------------------------------------------
  // TEST 2 — Add your next test here following the same pattern
  // -----------------------------------------------------------------------
  // "writing-test-2": {
  //   task1: {
  //     type: "task1",
  //     promptText: "...",
  //     chartDescription: `...`,
  //   },
  //   task2: {
  //     type: "task2",
  //     promptText: "...",
  //   },
  // },

};

// ---------------------------------------------------------------------------
// SYSTEM PROMPT
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a certified IELTS examiner with 15 years of experience assessing Academic Writing tests.

You score responses strictly according to official IELTS band descriptors (scale: 0–9, increments of 0.5).

For Task 1 you will be given a full text description of the chart or diagram that the candidate was asked to describe. Use ONLY this description to assess whether the candidate accurately reported data, selected key features, and made relevant comparisons. Do not attempt to interpret any image — rely entirely on the provided chart description.

You must ALWAYS respond with valid JSON only — no markdown code fences, no preamble, no explanation outside the JSON.`;

// ---------------------------------------------------------------------------
// PROMPT BUILDER
// ---------------------------------------------------------------------------

function buildPrompt(
  testDef: TestDefinition,
  essay1: string,
  essay2: string,
  wordCount1: number,
  wordCount2: number
): string {
  const t1 = testDef.task1;
  const t2 = testDef.task2;

  const chartSection = t1.chartDescription
    ? `\nCHART DATA (use this to assess accuracy — do not look for an image):\n${t1.chartDescription}\n`
    : "";

  return `
Please evaluate the following two IELTS Academic Writing responses.

═══════════════════════════════
TASK 1  (minimum 150 words — candidate wrote ${wordCount1} words)
═══════════════════════════════
TASK INSTRUCTIONS:
${t1.promptText}
${chartSection}
CANDIDATE'S RESPONSE:
${essay1.trim() || "(no response written)"}

═══════════════════════════════
TASK 2  (minimum 250 words — candidate wrote ${wordCount2} words)
═══════════════════════════════
TASK INSTRUCTIONS:
${t2.promptText}

CANDIDATE'S RESPONSE:
${essay2.trim() || "(no response written)"}

═══════════════════════════════
SCORING INSTRUCTIONS
═══════════════════════════════
Return ONLY a JSON object with this exact structure:

{
  "overall": 6.5,
  "overallDescriptor": "Competent User",
  "part1": {
    "taskAchievement": 6.5,
    "coherenceCohesion": 7.0,
    "lexicalResource": 6.0,
    "grammaticalRange": 6.5,
    "strengths": [
      "Specific strength quoting or referencing something the candidate actually wrote",
      "Another specific strength"
    ],
    "improvements": [
      {
        "point": "Clear explanation of the issue",
        "before": "Exact or representative sentence from the candidate's response",
        "after": "Your improved version of that sentence"
      }
    ]
  },
  "part2": {
    "taskResponse": 6.5,
    "coherenceCohesion": 7.0,
    "lexicalResource": 6.0,
    "grammaticalRange": 6.5,
    "strengths": [
      "Specific strength"
    ],
    "improvements": [
      {
        "point": "Issue description",
        "before": "Candidate's sentence",
        "after": "Improved version"
      }
    ]
  }
}

Rules:
- All scores on 0–9 scale in 0.5 increments only.
- Overall = (part1 average × 0.4) + (part2 average × 0.6), rounded to nearest 0.5.
- overallDescriptor: "Expert User" (9), "Very Good User" (8–8.5), "Good User" (7–7.5), "Competent User" (6–6.5), "Modest User" (5–5.5), "Limited User" (4–4.5), "Extremely Limited User" (3–3.5).
- If a response is empty or absent, score all its criteria 0.
- Strengths and improvements must be SPECIFIC to what this candidate wrote — no generic statements.
- For Task 1: assess data accuracy against the chart description provided above.
- "before" must be a real sentence from the candidate's text. "after" must fix the specific problem.
- Provide 2–3 strengths and 2–4 improvements per part.
  `.trim();
}

// ---------------------------------------------------------------------------
// RATE LIMITING (simple in-memory — replace with Redis for production)
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX      = 10;   // max requests
const RATE_LIMIT_WINDOW   = 60 * 60 * 1000; // per hour (ms)

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// MAIN HANDLER
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // --- API key check ---
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: OPENAI_API_KEY not set." },
      { status: 500 }
    );
  }

  // --- Rate limiting ---
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // --- Parse body ---
  let body: {
    testId?: string;
    essay1?: string;
    essay2?: string;
    wordCount1?: number;
    wordCount2?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { testId, essay1 = "", essay2 = "", wordCount1 = 0, wordCount2 = 0 } = body;

  // --- Validate testId ---
  if (!testId || !TEST_LIBRARY[testId]) {
    return NextResponse.json(
      { error: `Unknown testId: "${testId}". Add it to TEST_LIBRARY in route.ts.` },
      { status: 400 }
    );
  }

  // --- Validate at least one essay is non-empty ---
  if (!essay1.trim() && !essay2.trim()) {
    return NextResponse.json(
      { error: "Both responses are empty. Please write at least one response." },
      { status: 400 }
    );
  }

  const testDef = TEST_LIBRARY[testId];
  const prompt  = buildPrompt(testDef, essay1, essay2, wordCount1, wordCount2);

  // --- Call OpenAI ---
  let openAIResponse: Response;
  try {
    openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.3,
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user",   content: prompt },
        ],
      }),
    });
  } catch (networkErr) {
    console.error("OpenAI network error:", networkErr);
    return NextResponse.json(
      { error: "Could not reach OpenAI. Check your network or try again." },
      { status: 502 }
    );
  }

  if (!openAIResponse.ok) {
    const errBody = await openAIResponse.json().catch(() => ({})) as { error?: { message?: string } };
    const message = errBody?.error?.message ?? `OpenAI returned status ${openAIResponse.status}`;
    console.error("OpenAI API error:", message);
    return NextResponse.json({ error: message }, { status: openAIResponse.status });
  }

  // --- Parse OpenAI response ---
  const aiData = await openAIResponse.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  const rawContent = aiData.choices?.[0]?.message?.content?.trim() ?? "";

  let feedback: FeedbackResult;
  try {
    // Strip markdown fences if model accidentally adds them
    const cleaned = rawContent.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    feedback = JSON.parse(cleaned) as FeedbackResult;
  } catch (parseErr) {
    console.error("Failed to parse OpenAI JSON:", rawContent, parseErr);
    return NextResponse.json(
      { error: "AI returned an unexpected format. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(feedback);
}

// Reject non-POST methods cleanly
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
