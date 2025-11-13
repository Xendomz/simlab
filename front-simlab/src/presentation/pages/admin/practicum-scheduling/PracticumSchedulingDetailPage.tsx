import { useAuth } from "@/application/hooks/useAuth"
import { userRole } from "@/domain/User/UserRole"
import Header from "@/presentation/components/Header"
import ManagementPracticumSchedulingDetailPage from "./ManagementPracticumSchedulingDetailPage"
import LecturerPracticumSchedulingDetailPage from "./LecturerPracticumSchedulingDetailPage"

const PracticumSchedulingDetailPage = () => {
    const { user } = useAuth()

    if (!user) return null

    if (user.role === userRole.Dosen) {
        return (
            <>
                <Header title="Detail Penjadwalan Praktikum" />
                <LecturerPracticumSchedulingDetailPage />
            </>
        )
    }

    if ([userRole.KepalaLabJurusan, userRole.KepalaLabTerpadu, userRole.Laboran].includes(user.role)) {
        return (
            <>
                <Header title="Detail Penjadwalan Praktikum" />
                <ManagementPracticumSchedulingDetailPage />
            </>
        )
    }
}

export default PracticumSchedulingDetailPage
