import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const artist = await prisma.user.findFirst({
            where: { email: 'turningpoint@fannybags.com' },
            include: {
                songs: true
            }
        });

        if (!artist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        return NextResponse.json(artist.songs);

    } catch (error) {
        console.error('Campaigns API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
