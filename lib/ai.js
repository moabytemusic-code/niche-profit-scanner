
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeNiche(niche, platform) {
    if (!process.env.OPENAI_API_KEY) {
        // Fallback Mock Data if no key
        return {
            demand_score: 8,
            competition_score: 5,
            monetization_score: 9,
            total_score: 8,
            demand_explanation: "Consistent search volume with upward trend.",
            competition_explanation: "Moderate competition, dominance by big brands but room for personal brands.",
            monetization_explanation: "High ticket affiliate offers available.",
            content_ideas: [
                `How to get started with ${niche} in 2024`,
                `Top 5 Mistakes Beginners Make with ${niche}`,
                `${niche} vs Competitor: The Truth`
            ],
            product_ideas: [
                "Premium Video Course",
                "Exclusive Community Access",
                "Recommended Software Toolkit"
            ]
        }
    }

    const prompt = `
    Analyze the niche "${niche}" specifically for the platform "${platform}".
    Act as a veteran Affiliate Marketer.

    Return a JSON object with:
    - demand_score (1-10)
    - competition_score (1-10) (10 = saturated, 1 = empty)
    - monetization_score (1-10)
    - total_score (1-10) (Overall potential)
    - demand_explanation (1 sentence)
    - competition_explanation (1 sentence)
    - monetization_explanation (1 sentence)
    - content_ideas (Array of 10 viral content hooks/titles)
    - product_ideas (Array of 10 affiliate product types or digital products to sell)
  `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error("AI Error", e);
        return null;
    }
}
