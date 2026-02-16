import { NextResponse } from 'next/server';

export async function GET() {
    // Exact data from screenshot
    const offers = [
        {
            id: 'o1',
            khapeetarName: 'Rohit Malhotra',
            service: 'Release Marketing',
            location: 'Pune, India',
            budget: '₹30,000',
            timeline: '14 days',
            notes: 'Includes ad setup, creating content, seeding and reports.',
            avatar: '/app/avatars/aarav.png', // Correct existing file
            isFeatured: true
        },
        {
            id: 'o2',
            khapeetarName: 'Shreya Singh',
            service: 'Release Marketing',
            location: 'Chandigarh, India',
            budget: '₹25,000',
            timeline: '20 days',
            notes: 'Strategic rollout plan...',
            avatar: '/app/avatars/riya.png', // Correct existing file
            isFeatured: false
        }
    ];

    return NextResponse.json(offers);
}
