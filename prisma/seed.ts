const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Artist "Turning Point"
    const artist = await prisma.user.upsert({
        where: { email: 'turningpoint@fannybags.com' },
        update: {},
        create: {
            name: 'Turning Point',
            email: 'turningpoint@fannybags.com',
            avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=TurningPoint',
            location: 'Mumbai, India',
            badges: JSON.stringify(['BIG LEAGUE', 'LOCAL LEGEND', 'TURNING POINT']),
            wallet: {
                create: {
                    availableBalance: 82450,
                    pendingPayouts: 5200,
                    lifetimeEarnings: 315800,
                    transactions: {
                        create: [
                            { amount: 1200, type: 'Payout', status: 'Completed', date: new Date('2023-10-26') },
                            { amount: 10000, type: 'Investment', status: 'Completed', date: new Date('2023-10-24') },
                            { amount: 1500, type: 'Sale', status: 'Completed', date: new Date('2023-10-20') },
                            { amount: 20000, type: 'Deposit', status: 'Completed', date: new Date('2023-10-15') },
                            { amount: 850, type: 'Payout', status: 'Pending', date: new Date('2023-10-12') },
                        ]
                    }
                }
            },
            songs: {
                create: [
                    {
                        title: 'Midnight Drive',
                        status: 'Live',
                        khapeetarStatus: 'Completed',
                        fundsRaised: 80000,
                        fundingSource: 'Fan',
                        releaseStatus: 'Pending',
                        streams: 18450,
                        revenue: 9225,
                        paidOut: 0
                    },
                    {
                        title: 'City Lights',
                        status: 'Funded',
                        khapeetarStatus: 'Pending',
                        khapeetarName: 'Riya Kapoor',
                        fundsRaised: 120000,
                        fundingSource: 'Fan',
                        releaseStatus: 'Pending',
                        streams: 92300,
                        revenue: 46150,
                        paidOut: 18000
                    },
                    {
                        title: 'No Signal',
                        status: 'Draft',
                        khapeetarStatus: 'Pending',
                        fundsRaised: 0,
                        fundingSource: 'Fan',
                        releaseStatus: 'Pending',
                        streams: 120000,
                        revenue: 0,
                        paidOut: 0
                    },
                    {
                        title: 'After Dark',
                        status: 'Released',
                        khapeetarStatus: 'Completed',
                        fundsRaised: 200000,
                        fundingSource: 'Fan',
                        releaseStatus: 'Completed',
                        streams: 50000,
                        revenue: 25000,
                        paidOut: 24500
                    },
                    {
                        title: 'Self Made',
                        status: 'Self Funding',
                        khapeetarStatus: 'Self',
                        fundsRaised: 0,
                        fundingSource: 'Self',
                        releaseStatus: 'Completed',
                        streams: 10000,
                        revenue: 5000,
                        paidOut: 0
                    }
                ]
            }
        },
    });

    console.log(`Created artist with id: ${artist.id}`);
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
