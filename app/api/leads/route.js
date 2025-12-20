import { NextResponse } from 'next/server';
import { createBrevoContact } from '@/lib/brevo'; // We might need a 'getBrevoContacts' function

export async function GET() {
    // In a real app with a database, we would fetch from our DB.
    // Since we are pushing to Brevo, we can fetch from Brevo API to show the latest leads.

    // For now, let's mock or fetch from Brevo if we add that function.
    // Let's assume we want to fetch from Brevo.

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'No API Key' }, { status: 500 });

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts?limit=50&offset=0&sort=desc', {
            headers: { 'api-key': apiKey }
        });
        const data = await response.json();

        // Filter or map to just get email and attributes
        const leads = data.contacts?.map(c => ({
            id: c.id,
            email: c.email,
            createdAt: c.createdAt,
            attributes: c.attributes
        })) || [];

        return NextResponse.json({ leads });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
