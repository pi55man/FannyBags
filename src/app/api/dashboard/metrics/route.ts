import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Determine the artist (Mocking session by picking the seeded user)
        const artist = await prisma.user.findFirst({
            where: { email: 'turningpoint@fannybags.com' },
            include: {
                songs: true,
                wallet: true
            }
        });

        if (!artist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        const songs = artist.songs;

        // Calculate Metrics
        const activeSongs = songs.length; // Simply total songs for now

        const fundsRaised = songs.reduce((acc, song) => acc + song.fundsRaised, 0);

        // Total Payouts from Wallet transactions would be more accurate 
        // but we can also use the Song.paidOut field if we track it there, 
        // or Wallet.lifetimeEarnings (which seems to match total payouts concept)
        const totalPayouts = artist.wallet?.lifetimeEarnings || 0;

        return NextResponse.json({
            activeSongs,
            fundsRaised,
            totalPayouts
        });

    } catch (error) {
        console.error('Metrics API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
