import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import styles from './LayoutShell.module.css'

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>
            {/* Desktop Sidebar */}
            <Sidebar />

            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    )
}
