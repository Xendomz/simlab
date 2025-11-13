import { useAuth } from '@/application/hooks/useAuth'
import Header from '@/presentation/components/Header'
import KepalaLabTerpaduPracticumScheduleApproval from './components/KepalaLabTerpaduPracticumScheduleApproval'
import LaboranPracticumScheduleApproval from './components/LaboranPracticumScheduleApproval'
import { userRole } from '@/domain/User/UserRole'

const PracticumSchedulingVerification = () => {
    const { user } = useAuth()
    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            { user?.role === userRole.KepalaLabTerpadu && (
                <KepalaLabTerpaduPracticumScheduleApproval/>
            )}
            { user?.role === userRole.Laboran && (
                <LaboranPracticumScheduleApproval/>
            )}
        </>
    )
}

export default PracticumSchedulingVerification
