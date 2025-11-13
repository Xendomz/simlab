import { useAuth } from '@/application/hooks/useAuth';
import { userRole } from '@/domain/User/UserRole';
import PracticumSchedulingListPage from './PracticumSchedulingListPage';
import PracticumSchedulingTeachingListPage from './PracticumSchedulingTeachingListPage';

const PracticumSchedulingPage = () => {

    const { user } = useAuth()

    if (!user) return null

    switch (user.role) {
        case userRole.KepalaLabJurusan:
            return <PracticumSchedulingListPage />

        case userRole.Dosen:
            return <PracticumSchedulingTeachingListPage/>

        default:
            return (<>Unauthorized</>)
    }
}

export default PracticumSchedulingPage
