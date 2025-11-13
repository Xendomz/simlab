import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
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

export const PracticumScheduleVerificationColumn = ({ role, openApproval, openRejection }: ColumnProps): ColumnDef<PracticumSchedulingView>[] => [
    {
        header: 'Tahun Akademik',
        accessorKey: 'academicYear',
        cell: ({ row }) => (
            `${row.original.academicYear?.name}`
        )
    },
    {
        header: 'Praktikum',
        accessorKey: 'praktikumId',
        cell: ({ row }) => (
            `${row.original.practicum?.name}`
        )
    },
    {
        header: "Tanggal Pengajuan",
        accessorKey: 'createdAt',
        cell: ({ row }) => (
            `${row.original.createdAt.formatForInformation()}`
        )
    },
    {
        header: 'Informasi Pengajuan', accessorKey: 'activityName', cell: ({ row }) => (
            <NavLink to={`/panel/penjadwalan-praktikum/${row.original.id}/detail`}>
                <Button size="sm" variant="secondary">Detail</Button>
            </NavLink>
        )
    },
    {
        header: 'Verifikasi Pengajuan', accessorKey: 'id', cell: ({ row }) => {
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