
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function generateEmail(niche, offers, index, total) {
    // Define the specific phase based on email index
    let phase = "";
    let topicFocus = "";

    if (index <= 15) {
        phase = "Phase 1: Foundation & Mindset";
        topicFocus = "Validating the niche, understanding the customer avatar, and adopting a business mindset.";
    } else if (index <= 35) {
        phase = "Phase 2: The Setup (Tech Stack)";
        topicFocus = "Buying domains, setting up hosting, installing WordPress/CMS, and basic branding. (Promote Hosting/Domains)";
    } else if (index <= 60) {
        phase = "Phase 3: Content & Traffic";
        topicFocus = "SEO, keyword research, writing content, social media promotion, and video marketing. (Promote SEO Tools, AI Writers)";
    } else if (index <= 80) {
        phase = "Phase 4: Scaling & Monetization";
        topicFocus = "Email lists, advanced affiliate strategies, paid ads, and outsourcing. (Promote Email Tools, Ad Spy Tools)";
    } else {
        phase = "Phase 5: Digital Empire (Own Products)";
        topicFocus = "Creating and selling your own digital products like eBooks, video courses, and private communities. Moving beyond affiliate commissions to 100% profit margins.";
    }

    const prompt = `
    You are an expert 7-figure affiliate marketer and copywriter.
    Write Email #${index} of a ${total}-email "Zero to Hero" sequence for users of a "Niche Profit Scanner" tool.
    
    Current Phase: ${phase}
    Focus: ${topicFocus}
    
    Context: The user has just discovered a potential niche using our tool. Now they need to build the business.
    
    Goal: Provide a valuable, actionable tip related to the current phase, and naturally weave in a recommendation for a relevant tool or service (Affiliate Offer).
    
    General Affiliate Categories to mention where appropriate: ${offers}.
    
    Requirements:
    - Subject Line: High curiosity, punchy, personal (lower case feel).
    - Tone: Encouraging, authoritative, "in the trenches" advice.
    - Body: 
        - Start with a hook or story.
        - Give the "Tip of the Day".
        - Transition to a relevant tool/resource (Use placeholders like [LINK: BLUEHOST] or [LINK: SEMRUSH] so I can swap them later).
    - Format: Return ONLY a JSON object with keys: "subject", "body" (HTML content).
    - HTML: Use clean, simple HTML (<p>, <strong>, <ul>, <br>). No complex styles.
    `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error(`Error generating email ${index}:`, e);
        return null; // Retry logic could be added here
    }
}

async function main() {
    const args = process.argv.slice(2);
    const nicheArgIndex = args.indexOf('--niche');
    const offersArgIndex = args.indexOf('--offers');

    if (nicheArgIndex === -1) {
        console.error("Please provide a niche using --niche 'Your Niche'"); // Fixed typo
        process.exit(1);
    }

    const niche = args[nicheArgIndex + 1];
    const offers = offersArgIndex !== -1 ? args[offersArgIndex + 1] : "Generic relevant affiliate offers";
    const count = 100;

    console.log(`Generating ${count} emails for niche: "${niche}" with offers: "${offers}"...`);

    const campaigns = [];

    // Create data directory if not exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    for (let i = 1; i <= count; i++) {
        console.log(`Generating email ${i}/${count}...`);
        const emailData = await generateEmail(niche, offers, i, count);

        if (emailData) {
            campaigns.push({
                index: i,
                ...emailData
            });
            // Save incrementally to avoid losing progress
            fs.writeFileSync(
                path.join(dataDir, `${niche.replace(/\s+/g, '_').toLowerCase()}_campaigns.json`),
                JSON.stringify(campaigns, null, 2)
            );
        }

        // Small delay to avoid rate limits if necessary
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Done! Saved to data directory.");
}

main().catch(console.error);
