import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Strict Validation
        if (!body.title || !body.genre || !body.status) {
            return NextResponse.json(
                { error: 'Missing required fields: title, genre, or status' },
                { status: 400 }
            );
        }

        if (body.status === 'released') {
            if (!body.upc || !body.songLink || !body.migrationConfirmed) {
                return NextResponse.json({ error: 'Missing released fields: UPC, Song Link, or Migration Agreement' }, { status: 400 });
            }
        } else if (body.status === 'unreleased') {
            if (!body.distributorType) {
                return NextResponse.json({ error: 'Missing distributor selection' }, { status: 400 });
            }
            if (body.distributorType === 'own' && !body.distributor) {
                return NextResponse.json({ error: 'Distributor name required when using own distributor' }, { status: 400 });
            }
        }

        if (!body.closeDate || !body.releaseDate) {
            return NextResponse.json({ error: 'Dates are required' }, { status: 400 });
        }

        // Mock Database Save with UUID
        const campaignId = 'd290f1ee-6c54-4b01-90e6-' + Date.now().toString(16);

        console.log('Saved Campaign Draft:', {
            id: campaignId,
            ...body,
            created_at: new Date().toISOString(),
            status: 'draft'
        });

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            campaignId: campaignId,
            message: 'Campaign draft saved successfully'
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
