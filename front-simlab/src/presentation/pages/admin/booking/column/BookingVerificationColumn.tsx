import { BookingView } from "@/application/booking/BookingView";
import { BookingType } from "@/domain/booking/BookingType";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

interface ColumnProps {
    role: 'Kepala Lab Terpadu' | 'Laboran';
    openApproval: (booking: BookingView) => void;
    openRejection: (booking: BookingView) => void;
}

export const BookingVerificationColumn = ({ role, openApproval, openRejection }: ColumnProps): ColumnDef<BookingView>[] => [
    { header: 'Tahun Akademik', accessorKey: 'academicYear', cell: ({ row }) => row.original.academicYear?.academicYear },
    {
        header: 'Identitas Peminjam', accessorKey: 'user',
        cell: ({ row }) => (
            <div className='flex flex-col'>
                <span className='font-semibold'>{row.original.user?.name} | {row.original.user?.identityNum}</span>
                <span className='text-sm'>Prodi: {row.original.user?.studyProgram?.name}</span>
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
        header: 'Informasi Peminjaman', accessorKey: 'activityName', cell: ({ row }) => (
            <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
                <Button size="sm" variant="secondary">Detail</Button>
            </NavLink>
        )
    },
    {
        header: 'Verifikasi Peminjaman', accessorKey: 'id', cell: ({ row }) => {
            const renderApprovalBadge = (approval: any) => {
                if (!approval) return null;
                return approval.approved ? (
                    <Badge>Peminjaman Distujui</Badge>
                ) : (
                    <Badge variant={'destructive'}>Peminjaman Ditolak</Badge>
                );
            };

            const kepalaLabApproval = row.original.kepalaLabApproval;
            const laboranApproval = row.original.laboranApproval;

            // If kepala lab rejected, laboran is also considered rejected
            if (role === 'Laboran' && kepalaLabApproval && kepalaLabApproval.approved === false) {
                return renderApprovalBadge({ approved: false });
            }

            // Determine approval object based on role
            const approval = role === 'Kepala Lab Terpadu' ? kepalaLabApproval : laboranApproval;
            const isPending = !approval;

            return (
                <>
                    {renderApprovalBadge(approval)}
                    {isPending && (
                        <div className='flex gap-2'>
                            <Button size="sm" onClick={() => openApproval(row.original)}>Terima</Button>
                            <Button size="sm" onClick={() => openRejection(row.original)} variant="destructive">Tolak</Button>
                        </div>
                    )}
                </>
            );
        }
    }
];