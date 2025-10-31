import { BookingView } from "@/application/booking/BookingView";
import { BookingType } from "@/domain/booking/BookingType";
import { userRole } from "@/domain/User/UserRole";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { NavLink } from "react-router-dom";

interface ColumnProps {
    role: userRole;
    openApproval: (id: number) => void;
    openRejection: (id: number) => void;
}

export const BookingVerificationColumn = ({ role, openApproval, openRejection }: ColumnProps): ColumnDef<BookingView>[] => [
    { header: 'Tahun Akademik', accessorKey: 'academicYear', cell: ({ row }) => row.original.academicYear?.name },
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
            const renderApprovalBadge = (is_approved: number | null | undefined) => {
                if (is_approved === 1) {
                    return <Badge>Pengajuan Disetujui</Badge>;
                }

                if (is_approved === 2) {
                    return <Badge variant={'warning'}>Pengajuan Dalam Proses Revisi</Badge>;
                }

                if (is_approved === 0) {
                    return <Badge variant={'destructive'}>Pengajuan Ditolak</Badge>;
                }
            };

            const kepalaLabApproval = row.original.kepalaLabApproval;
            const laboranApproval = row.original.laboranApproval;

            // If kepala lab rejected, laboran is also considered rejected
            if (role === userRole.Laboran && kepalaLabApproval && kepalaLabApproval.isApproved === 0) {
                return renderApprovalBadge(0);
            }

            // Determine approval object based on role (nullable)
            let approval: number | null = null;
            if (role === userRole.KepalaLabTerpadu) {
                approval = kepalaLabApproval?.isApproved ?? null;
                console.log(kepalaLabApproval);
                
            } else {
                approval = laboranApproval?.isApproved ?? null;
            }

            const isPending = approval === null || approval === undefined;

            return (
                <>
                    {renderApprovalBadge(approval)}
                    {isPending && (
                        <div className='flex gap-2'>
                            <Button size="sm" onClick={() => openApproval(row.original.id)}>Terima</Button>
                            {/* <Button size="sm" onClick={() => openRevision(row.original.id)} variant="warning">Revisi</Button> */}
                            <Button size="sm" onClick={() => openRejection(row.original.id)} variant="destructive">Tolak</Button>
                        </div>
                    )}
                </>
            );
        }
    }
];