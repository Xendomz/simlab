import { useAuth } from '@/application/hooks/useAuth'
import Header from '@/presentation/components/Header'
import KepalaLabBookingApproval from './components/KepalaLabBookingApproval'
import LaboranBookingApproval from './components/LaboranBookingApproval'
import { userRole } from '@/domain/User/UserRole'

const BookingVerification = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Menu Peminjaman" />
            { user?.role === userRole.KepalaLabTerpadu && (
                <KepalaLabBookingApproval/>
            )}
            { user?.role === userRole.Laboran && (
                <LaboranBookingApproval/>
            )}
        </>
    )
}

export default BookingVerification
