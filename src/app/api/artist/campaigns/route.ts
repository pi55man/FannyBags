import { NextResponse } from 'next/server';

export async function GET() {
    // Exact data from screenshot
    const campaigns = [
        {
            id: '1',
            title: 'Midnight Drive',
            artist_name: 'Midnight Drive',
            status: 'Campaign Live',
            cover_image: 'bg-gradient-to-br from-blue-600 to-purple-600', // Matches frontend fallback logic
        },
        {
            id: '2',
            title: 'No Signal',
            artist_name: 'Abstract Sound',
            status: 'Funding Complete',
            cover_image: 'bg-gradient-to-br from-indigo-500 to-pink-500',
        },
        {
            id: '3',
            title: 'City Lights',
            artist_name: 'Draft',
            status: 'Draft',
            cover_image: 'bg-gradient-to-br from-gray-700 to-gray-600',
        }
    ];

    return NextResponse.json(campaigns);
}
