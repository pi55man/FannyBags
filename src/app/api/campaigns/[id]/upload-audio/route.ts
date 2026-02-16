import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.includes('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav')) {
            return NextResponse.json({ error: 'Invalid file type. Only WAV or MP3.' }, { status: 400 });
        }

        console.log(`Uploading file ${file.name} for campaign ${id} (${file.size} bytes)`);

        // Mock S3 Upload Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Return a mock URL
        return NextResponse.json({
            success: true,
            fileUrl: `https://storage.fannybags.com/campaigns/${id}/${file.name}`,
            message: 'File uploaded successfully'
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
