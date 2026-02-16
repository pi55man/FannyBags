import { NextResponse } from 'next/server';

export async function GET() {
    // Matches screenshot Section 4
    const deals = [
        {
            id: 'ad1',
            song: 'Midnight Drive',
            khapeetar: 'Riya Kapoor',
            service: 'Music Video',
            budget: '₹25,000',
            status: 'Work in Progress'
        }
    ];

    return NextResponse.json(deals);
}
