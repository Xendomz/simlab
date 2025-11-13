import { BookingView } from "@/application/booking/BookingView";
import { BookingType } from "@/domain/booking/BookingType";
import { userRole } from "@/domain/User/UserRole";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";
import BookingBadgeStatus from "../components/BookingBadgeStatus";
import BookingVerificationAction from "../components/BookingVerificationAction";

interface ColumnProps {
    role: userRole;
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
    openReturnVerification?: (id: number) => void;
    openReturnConfirmation?: (id: number) => void;
}

export const BookingVerificationColumn = ({ role, openApproval, openRejection, openReturnVerification, openReturnConfirmation }: ColumnProps): ColumnDef<BookingView>[] => [
    { header: 'Tahun Akademik', accessorKey: 'academicYear', cell: ({ row }) => row.original.academicYear },
    {
        header: 'Identitas Peminjam', accessorKey: 'user',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <span className='font-semibold'>{row.original.requestor?.name}</span>
                <span className='text-sm'>Email: {row.original.requestor?.email}</span>
            </div>
        )
    },
    {
        header: 'Kebutuhan', accessorKey: 'purpose',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <span className='font-semibold'>{row.original.purpose}</span>
                <span className='text-sm'>Judul: {row.original.activityName}</span>
            </div>
        )
    },
    {
        header: 'Waktu', accessorKey: 'startTime', cell: ({ row }) => (
            <Badge variant={'secondary'}>{row.original.startTime.formatForInformation()} | {row.original.endTime.formatForInformation()}</Badge>
        )
    },
    {
        header: 'Jenis', accessorKey: 'bookingType', cell: ({ row }) => {
            let text = '';
            switch (row.original.bookingType) {
                case BookingType.Room: text = 'Peminjaman Ruangan'; break;
                case BookingType.RoomNEquipment: text = 'Peminjaman Ruangan dan Alat'; break;
                case BookingType.Equipment: text = 'Peminjaman Alat'; break;
            }
            return <Badge>{text}</Badge>;
        }
    },
    {
        header: 'Status Peminjaman', accessorKey: 'status',
        cell: ({ row }) => (
            <BookingBadgeStatus status={row.original.status} />
        )
    },
    {
        header: 'Informasi Peminjaman', accessorKey: 'activityName', cell: ({ row }) => (
            <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
                <Button size="sm" variant="secondary">Detail</Button>
            </NavLink>
        )
    },
    {
        header: 'Verifikasi Peminjaman', accessorKey: 'id', cell: ({ row }) => (
            <BookingVerificationAction
                booking={row.original}
                role={role}
                openApproval={openApproval}
                openRejection={openRejection}
                openReturnVerification={openReturnVerification}
                openReturnConfirmation={openReturnConfirmation}
            />
        )
    }
];