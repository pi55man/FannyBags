import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // 1. Validation
        if (!id) {
            return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
        }

        // Validate basic fields
        if (!body.fundingAsk || body.fundingAsk < 200) {
            return NextResponse.json({ error: 'Invalid funding ask' }, { status: 400 });
        }

        if (body.revShareEnabled) {
            if (!body.fanSharePct || body.fanSharePct < 25 || body.fanSharePct > 100) {
                return NextResponse.json({ error: 'Invalid fan share percentage' }, { status: 400 });
            }
        }

        if (!body.khapeetarType) {
            return NextResponse.json({ error: 'Khapeetar selection required' }, { status: 400 });
        }

        if (!body.story || !body.vision) {
            return NextResponse.json({ error: 'Narrative content required' }, { status: 400 });
        }

        // Mock DB Save
        console.log(`[Campaign ${id}] Saving Funding details:`, body);

        // Simulate Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            message: 'Funding details saved successfully',
            data: {
                campaignId: id,
                status: 'draft',
                updatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
