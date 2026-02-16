import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const artist = await prisma.user.findFirst({
            where: { email: 'turningpoint@fannybags.com' },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            orderBy: { date: 'desc' }
                        }
                    }
                }
            }
        });

        if (!artist || !artist.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        return NextResponse.json({
            availableBalance: artist.wallet.availableBalance,
            pendingPayouts: artist.wallet.pendingPayouts,
            lifetimeEarnings: artist.wallet.lifetimeEarnings,
            transactions: artist.wallet.transactions
        });

    } catch (error) {
        console.error('Wallet API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, amount } = body;

        if (!type || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid transaction details' }, { status: 400 });
        }

        const artist = await prisma.user.findFirst({
            where: { email: 'turningpoint@fannybags.com' },
            include: { wallet: true }
        });

        if (!artist || !artist.wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        const currentBalance = artist.wallet.availableBalance;

        let newBalance = currentBalance;
        if (type === 'Deposit') {
            newBalance += amount;
        } else if (type === 'Withdrawal') {
            if (currentBalance < amount) {
                return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
            }
            newBalance -= amount;
        } else {
            return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
        }

        // Transaction & Balance Update
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: artist.wallet.id },
                data: { availableBalance: newBalance }
            }),
            prisma.transaction.create({
                data: {
                    type: type,
                    amount: amount,
                    status: 'Completed',
                    date: new Date(),
                    walletId: artist.wallet.id
                }
            })
        ]);

        return NextResponse.json({ success: true, newBalance });

    } catch (error) {
        console.error('Wallet Transaction Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
