import { NextResponse } from 'next/server';

const KITCHENS_DB_ID = 'e47bd0a4-dc59-4f47-a2bd-d6503f8c757f';
const BASE_URL = 'https://baget.ai/api/public/databases';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, location, cuisine_type, bio } = body;

        // Validation
        if (!name || !location || !cuisine_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Austin Compliance Check: Pivot to Vegetarian for Austin cooks
        let adjustedCuisine = cuisine_type;
        if (location.toLowerCase().includes('austin')) {
            if (!cuisine_type.toLowerCase().includes('vegetarian') && !cuisine_type.toLowerCase().includes('plant')) {
                adjustedCuisine = `Vegetarian ${cuisine_type}`;
            }
        }

        const data = {
            name,
            location,
            cuisine_type: adjustedCuisine,
            verification_status: 'Onboarding (Verification Pending)',
            // We can also store the bio in a separate column if we update the DB, 
            // but for now we follow the existing schema.
        };

        const response = await fetch(`${BASE_URL}/${KITCHENS_DB_ID}/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

        if (!response.ok) {
            throw new Error('Failed to insert into database');
        }

        return NextResponse.json({ success: true, message: 'Kitchen registration submitted' });
    } catch (error) {
        console.error('Onboarding API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
