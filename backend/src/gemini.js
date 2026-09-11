import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-key')) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Google Gemini API client initialized with gemini-2.5-flash');
  } catch (err) {
    console.warn('⚠️ Gemini client init failed:', err.message);
  }
} else {
  console.log('ℹ️ GEMINI_API_KEY is not set. Intelligent financial reality checks will use heuristic fallback until an API key is provided in .env');
}

/**
 * Generate a savage, humorous, or analytical Reality Check based on financial metrics.
 */
export async function generateRealityCheck({
  salary,
  totalSpent,
  totalIncome,
  wasteSpent,
  wastePercentage,
  fixedCosts,
  remainingBalance,
  daysLeftInMonth,
  burnRatePerDay,
  projectedMonthEndBalance,
  topCategories,
  wasteTransactions,
  currency = 'INR',
  tone = 'savage' // 'savage' | 'balanced' | 'gentle'
}) {
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency;

  // If Gemini API is available, generate dynamic response with gemini-2.5-flash
  if (genAI && apiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are WealthPulse's AI Financial Reality Check Engine and ruthless personal finance coach.
Your job is to look at a user's exact monthly financial numbers and deliver an eye-opening, brutally honest, witty, yet deeply actionable financial diagnosis.

User's Current Monthly Financial State:
- Monthly Salary / Income: ${currencySymbol}${salary.toLocaleString()}
- Total Spent So Far: ${currencySymbol}${totalSpent.toLocaleString()} (${((totalSpent / salary) * 100).toFixed(1)}% of salary)
- Fixed Monthly Commitments (Rent, EMI, SIP, Subscriptions): ${currencySymbol}${fixedCosts.toLocaleString()}
- UNNECESSARY / IMPULSE "WASTE" SPENDING: ${currencySymbol}${wasteSpent.toLocaleString()} (${wastePercentage.toFixed(1)}% of total expenses)
- Remaining Balance: ${currencySymbol}${remainingBalance.toLocaleString()}
- Days Left in the Month: ${daysLeftInMonth} days
- Daily Burn Rate: ${currencySymbol}${burnRatePerDay.toLocaleString()} / day
- Projected Month-End Balance: ${currencySymbol}${projectedMonthEndBalance.toLocaleString()}
- Top Spending Categories: ${JSON.stringify(topCategories)}
- Recent Impulsive/Waste Purchases: ${JSON.stringify(wasteTransactions.slice(0, 4))}

Tone Requested: ${tone.toUpperCase()}
- If "SAVAGE": Deliver a hilarious, hard-hitting, Gen-Z / millennial reality check roast. Call them out directly on their impulsive waste purchases, bubble teas, or midnight shopping. Give them tough love like an aggressive elder sibling or Gordon Ramsay of personal finance.
- If "BALANCED": Be direct, analytical, urgent, and professional with a touch of clever wit.
- If "GENTLE": Be supportive, encouraging, constructive, and optimistic.

Output strictly valid JSON with this exact schema (no markdown fences, just pure JSON):
{
  "headline": "A punchy, viral one-liner headline summarizing their financial situation",
  "roast": "The main reality check paragraph (3-5 punchy sentences). Quote specific numbers, mention waste spending, and project what month-end will look like if they don't stop.",
  "financialHealthScore": 45, // Number between 0 (bankrupt emergency) to 100 (flawless discipline)
  "dangerLevel": "CRITICAL" | "WARNING" | "MODERATE" | "HEALTHY",
  "wasteDiagnosis": "A direct critique of how much money is leaking on 'waste' impulse purchases",
  "actionableTips": [
    "Tip 1: Immediate action for today to freeze unnecessary leakage",
    "Tip 2: Specific category to cap or trim this week",
    "Tip 3: Realistic projected savings if waste purchases are curbed immediately"
  ]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      // Clean possible markdown wrapper
      const jsonText = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (apiError) {
      console.error('Gemini API execution error, falling back to heuristic engine:', apiError.message);
    }
  }

  // High-fidelity fallback heuristic generator if API key is missing or quota hit
  return generateHeuristicRealityCheck({
    salary,
    totalSpent,
    wasteSpent,
    wastePercentage,
    fixedCosts,
    remainingBalance,
    daysLeftInMonth,
    burnRatePerDay,
    projectedMonthEndBalance,
    topCategories,
    wasteTransactions,
    currencySymbol,
    tone
  });
}

/**
 * Interactive Financial Coach Q&A with Gemini
 */
export async function askFinancialCoach({
  question,
  financialSummary,
  chatHistory = []
}) {
  if (genAI && apiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `
You are WealthPulse's AI Financial Coach - a smart, realistic, and street-smart financial advisor.
User's Financial Context:
${JSON.stringify(financialSummary, null, 2)}

User's Question: "${question}"

Instructions:
1. Give a direct, practical answer in 2 to 3 concise paragraphs.
2. If they ask about buying a luxury or discretionary item (e.g. "Can I buy shoes/AirPods?"), calculate whether they can realistically afford it based on their remaining balance and days left.
3. Keep the tone sharp, supportive, and mathematically grounded.
`;
      const result = await model.generateContent(prompt);
      return { answer: result.response.text().trim() };
    } catch (err) {
      console.error('Gemini Chat error:', err.message);
    }
  }

  // Fallback intelligent response
  return {
    answer: `Based on your remaining balance of ${financialSummary.currency || '₹'}${financialSummary.remainingBalance?.toLocaleString()} with ${financialSummary.daysLeftInMonth} days left in the month, your daily safe-to-spend limit is ${financialSummary.currency || '₹'}${financialSummary.safeDailySpend?.toLocaleString()}. You've already logged ${financialSummary.currency || '₹'}${financialSummary.wasteSpent?.toLocaleString()} in impulse/waste buys this month. We strongly recommend holding off on non-essential purchases until next payday, or cutting food deliveries by 50% to build a cash buffer.`
  };
}

/**
 * Heuristic financial reality check when no API key is present
 */
function generateHeuristicRealityCheck({
  salary,
  totalSpent,
  wasteSpent,
  wastePercentage,
  fixedCosts,
  remainingBalance,
  daysLeftInMonth,
  burnRatePerDay,
  projectedMonthEndBalance,
  topCategories,
  wasteTransactions,
  currencySymbol,
  tone
}) {
  const spendRatio = (totalSpent / (salary || 1)) * 100;
  const isBrokeRisk = projectedMonthEndBalance < (salary * 0.05);
  const wasteHeavy = wasteSpent > (salary * 0.15) || wastePercentage > 20;

  let headline = "";
  let roast = "";
  let dangerLevel = "HEALTHY";
  let score = 85;

  if (isBrokeRisk || spendRatio > 75) {
    dangerLevel = "CRITICAL";
    score = Math.max(15, Math.round(50 - (spendRatio / 2)));
    headline = `🚨 Code Red: You're on track to end the month with just ${currencySymbol}${Math.max(0, Math.round(projectedMonthEndBalance))}!`;
    roast = `Bro, wake up! You have burned through ${spendRatio.toFixed(0)}% of your salary with ${daysLeftInMonth} days still left on the clock. You're bleeding ${currencySymbol}${wasteSpent.toLocaleString()} purely on impulse and waste purchases. At this burn pace of ${currencySymbol}${burnRatePerDay.toLocaleString()}/day, your bank balance will be screaming for mercy before week 4 even starts!`;
  } else if (wasteHeavy || spendRatio > 50) {
    dangerLevel = "WARNING";
    score = 55;
    headline = `⚠️ Money Leakage Alert: ${wastePercentage.toFixed(0)}% of your spend is going to pure impulse buys!`;
    roast = `You're working hard just to hand over ${currencySymbol}${wasteSpent.toLocaleString()} to midnight delivery apps and impulse shopping carts. While your fixed obligations are ${currencySymbol}${fixedCosts.toLocaleString()}, your discretionary leaks are slowly torpedoing your savings. Rein it in before this month becomes a financial regret.`;
  } else {
    dangerLevel = "MODERATE";
    score = 78;
    headline = `✨ Stable, but don't get reckless: ${daysLeftInMonth} days remain!`;
    roast = `You're currently holding your ground with ${currencySymbol}${remainingBalance.toLocaleString()} remaining. However, you've still leaked ${currencySymbol}${wasteSpent.toLocaleString()} on non-essential impulse items. If you eliminate that waste tag completely for the next ${daysLeftInMonth} days, you could easily funnel an extra ${currencySymbol}${Math.round(wasteSpent * 1.5).toLocaleString()} straight into investments.`;
  }

  return {
    headline,
    roast,
    financialHealthScore: score,
    dangerLevel,
    wasteDiagnosis: `You have leaked ${currencySymbol}${wasteSpent.toLocaleString()} across ${wasteTransactions.length} flagged impulse items (${wastePercentage.toFixed(1)}% of your expenses).`,
    actionableTips: [
      `Lock down all food delivery & quick-commerce apps for the next 7 days. Cook at home to save an estimated ${currencySymbol}${Math.round(wasteSpent * 0.4)}.`,
      `Institute a mandatory "48-Hour Waiting Rule" before checking out any shopping cart above ${currencySymbol}1,000.`,
      `Cap your daily discretionary allowance strictly to ${currencySymbol}${Math.max(200, Math.round((remainingBalance * 0.6) / daysLeftInMonth))} to guarantee a positive month-end cushion.`
    ]
  };
}
