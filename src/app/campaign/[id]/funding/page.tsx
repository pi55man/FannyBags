import FundingAskForm from '@/components/FundingAskForm';

export default async function FundingAskPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
            <FundingAskForm campaignId={id} />
        </div>
    );
}
