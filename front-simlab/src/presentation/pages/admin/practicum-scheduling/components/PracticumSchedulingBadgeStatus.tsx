import { PracticumSchedulingStatus } from '@/domain/practicum-scheduling/PracticumSchedulingStatus'
import { Badge } from '@/presentation/components/ui/badge'

interface PracticumSchedulingBadgeStatusProps {
    status: PracticumSchedulingStatus
}

const PracticumSchedulingBadgeStatus = ({ status }: PracticumSchedulingBadgeStatusProps) => {
    switch (status) {
        case PracticumSchedulingStatus.Draft:
            return (
                <Badge variant={'secondary'}>Draft</Badge>
            )
        case PracticumSchedulingStatus.Pending:
            return (
                <Badge variant={'default'}>Pending</Badge>
            )

        case PracticumSchedulingStatus.Approved:
            return (
                <Badge variant={'success'}>Disetujui</Badge>
            )

        case PracticumSchedulingStatus.Revision:
            return (
                <Badge variant={'warning'}>Revisi</Badge>
            )

        case PracticumSchedulingStatus.Rejected:
            return (
                <Badge variant={'destructive'}>Ditolak</Badge>
            )
    }
}

export default PracticumSchedulingBadgeStatus