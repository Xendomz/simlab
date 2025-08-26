import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface ColumnProps {
    role: 'Kepala Lab Terpadu' | 'Laboran' | 'Koorprodi';
    openApproval: (booking: any) => void;
    openRejection?: (booking: any) => void;
}

export const PracticumScheduleVerificationColumn = ({ role, openApproval, openRejection }: ColumnProps): ColumnDef<PracticumSchedulingView>[] => [
    {
        header: 'Praktikum',
        accessorKey: 'praktikumId',
        cell: ({ row }) => (
            `${row.original.practicum?.name}`
        )
    },
    {
        header: "Ruangan",
        accessorKey: 'laboratoryRoomId',
        cell: ({ row }) => (
            `${row.original.laboratoryRoom?.name}`
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
        header: 'Verifikasi Peminjaman', accessorKey: 'id', cell: ({ row }) => {
            const renderApprovalBadge = (approval: any) => {
                if (!approval) return null;
                return approval.approved ? (
                    <Badge>Peminjaman Distujui</Badge>
                ) : (
                    <Badge variant={'destructive'}>Peminjaman Ditolak</Badge>
                );
            };

            const kooprodiApproval = row.original.koorprodiApproval;
            const kepalaLabApproval = row.original.kepalaLabApproval;
            const laboranApproval = row.original.laboranApproval;

            // If kepala lab rejected, laboran is also considered rejected
            if (role === 'Laboran' && kepalaLabApproval && kepalaLabApproval.approved === false) {
                return renderApprovalBadge({ approved: false });
            }

            // If kooprodi rejected, all are considered rejected
            if (role !== 'Koorprodi' && kooprodiApproval && kooprodiApproval.approved === false) {
                return renderApprovalBadge({ approved: false });
            }

            // Determine approval object based on role
            let approval;
            if (role === 'Koorprodi') {
                approval = kooprodiApproval;
            } else if (role === 'Kepala Lab Terpadu') {
                approval = kepalaLabApproval;
            } else {
                approval = laboranApproval;
            }
            const isPending = !approval;

            return (
                <>
                    {renderApprovalBadge(approval)}
                    {isPending && (
                        <div className='flex gap-2'>
                            <Button size="sm" onClick={() => openApproval(row.original.id)}>Terima</Button>
                            {openRejection && (
                                <Button size="sm" onClick={() => openRejection(row.original.id)} variant="destructive">Tolak</Button>
                            )}
                        </div>
                    )}
                </>
            );
        }
    }
];