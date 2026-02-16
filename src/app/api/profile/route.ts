import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const artist = await prisma.user.findFirst({
            where: { email: 'turningpoint@fannybags.com' },
            include: {
                songs: {
                    orderBy: { streams: 'desc' }, // Popular songs
                    take: 10
                }
            }
        });

        if (!artist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        // Determine stats from songs
        const totalStreams = artist.songs.reduce((acc, s) => acc + s.streams, 0);
        // const totalListeners = ... (mocked in DB or separate field, I don't have listeners in Song model so I'll return a static/calculated value or add to schema. 
        // For now I'll just return what I have. The frontend expects specific data structure.

        return NextResponse.json({
            artist: {
                name: artist.name,
                location: artist.location,
                avatar: artist.avatar,
                badges: JSON.parse(artist.badges),
                stats: {
                    streams: totalStreams,
                    listeners: 150000, // Hardcoded as per seed/mock requirement for now since I didn't add listeners to schema
                    tracks: artist.songs.length
                }
            },
            songs: artist.songs
        });

    } catch (error) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
