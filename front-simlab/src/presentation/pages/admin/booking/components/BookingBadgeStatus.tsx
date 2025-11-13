import { BookingStatus } from '@/domain/booking/BookingStatus'
import { Badge } from '@/presentation/components/ui/badge'

interface BookingBadgeStatusProps {
    status: BookingStatus
}

const BookingBadgeStatus = ({ status }: BookingBadgeStatusProps) => {
    switch (status) {
        case BookingStatus.Draft:
            return (
                <Badge variant={'secondary'}>Draft</Badge>
            )
        case BookingStatus.Pending:
            return (
                <Badge variant={'default'}>Pending</Badge>
            )

        case BookingStatus.Approved:
            return (
                <Badge variant={'success'}>Disetujui</Badge>
            )

        case BookingStatus.Revision:
            return (
                <Badge variant={'warning'}>Revisi</Badge>
            )

        case BookingStatus.Rejected:
            return (
                <Badge variant={'destructive'}>Ditolak</Badge>
            )

        case BookingStatus.Returned:
            return (
                <Badge variant={'success'}>Telah Dikembalikan</Badge>
            )
    }
}

export default BookingBadgeStatus