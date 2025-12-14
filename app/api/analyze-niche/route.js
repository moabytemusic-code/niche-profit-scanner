
import { NextResponse } from 'next/server';
import { analyzeNiche } from '@/lib/ai';
import { sendBrevoEmail, createBrevoContact } from '@/lib/brevo';

export async function POST(request) {
    try {
        const { niche, platform, email } = await request.json();

        // 1. Analyze
        const data = await analyzeNiche(niche, platform);
        if (!data) return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });

        // 2. Teaser Response
        if (!email) {
            return NextResponse.json({
                type: 'teaser',
                score: data.total_score,
                demand: data.demand_score,
                competition: data.competition_score,
                monetization: data.monetization_score,
                preview_content: data.content_ideas[0],
                preview_product: data.product_ideas[0]
            });
        }

        // 3. Full Response & Email
        const htmlContent = `
      <h1>${niche} Profit Snapshot (${platform})</h1>
      <h2>Score: ${data.total_score}/10</h2>
      <p><strong>Demand:</strong> ${data.demand_explanation}</p>
      <p><strong>Competition:</strong> ${data.competition_explanation}</p>
      <p><strong>Monetization:</strong> ${data.monetization_explanation}</p>
      
      <h3>10 Viral Content Ideas</h3>
      <ul>${data.content_ideas.map(c => `<li>${c}</li>`).join('')}</ul>
      
      <h3>10 Product Ideas</h3>
      <ul>${data.product_ideas.map(p => `<li>${p}</li>`).join('')}</ul>
    `;

        await sendBrevoEmail({
            to: email,
            subject: `Your Niche Profit Scan: ${niche}`,
            htmlContent
        });

        await createBrevoContact({ email, attributes: { LEAD_SOURCE: 'Niche_Scanner' } });

        return NextResponse.json({ type: 'full', ...data });

    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
