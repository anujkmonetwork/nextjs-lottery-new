
import Header from '@/components/Header'
import LotteryEntrance from '@/components/LotteryEntrance'
import ManualHeader from '@/components/ManualHeader'
import Image from 'next/image'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from "web3uikit";

export default function Home() {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <Header />
                    <LotteryEntrance />
                </main>
            </NotificationProvider>
        </MoralisProvider>
    )
}
