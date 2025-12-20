
export async function sendBrevoEmail({ to, subject, htmlContent }) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return false;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
            sender: { name: 'Niche Profit Scanner', email: process.env.SENDER_EMAIL || 'noreply@example.com' },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent
        })
    });
    return response.ok;
}


export async function createBrevoContact({ email, attributes = {} }) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return false;

    const body = {
        email,
        updateEnabled: true,
        attributes
    };
    if (process.env.BREVO_LIST_ID) body.listIds = [parseInt(process.env.BREVO_LIST_ID)];

    await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify(body)
    });
}

export async function createCampaign({ name, subject, htmlContent, sender, scheduledAt, listIds }) {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) throw new Error("BREVO_API_KEY is missing");

    const response = await fetch('https://api.brevo.com/v3/emailCampaigns', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
            name,
            subject,
            sender,
            type: 'classic',
            htmlContent,
            recipients: { listIds },
            scheduledAt
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create campaign: ${JSON.stringify(error)}`);
    }

    return await response.json();
}
