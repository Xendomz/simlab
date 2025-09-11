import { useAuth } from '@/application/hooks/useAuth'
import Header from '@/presentation/components/Header'
import KepalaLabBookingApproval from './components/KepalaLabBookingApproval'
import LaboranBookingApproval from './components/LaboranBookingApproval'

const BookingVerification = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Menu Peminjaman" />
            { user?.role === 'Kepala Lab Terpadu' && (
                <KepalaLabBookingApproval/>
            )}
            { user?.role === 'Laboran' && (
                <LaboranBookingApproval/>
            )}
        </>
    )
}

export default BookingVerification
