import { PracticumSessionView } from "@/application/practicum-scheduling/PracticumSessionView";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

export const PracticumSchedulingLecturerSessionColumn = (handleOpenLecturerNotesConfirm: (id: number) => void): ColumnDef<PracticumSessionView>[] => {
    const columns: ColumnDef<PracticumSessionView>[] = [
        {
            header: 'Modul Praktikum',
            cell: ({ row }) => `${row.original.practicumModule?.name}`,
        },
        {
            header: 'Jadwal Praktikum',
            cell: ({ row }) => (
                <Badge variant={"secondary"}>{row.original.formattedDate()}</Badge>
            )
        },
        {
            header: 'Catatan Pertemuan',
            cell: ({ row }) => {
                if (row.original.lecturerComment?.trim()) {
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium">{row.original.lecturerComment}</span>
                            <span className="text-muted-foreground text-xs">{row.original.lecturerCommentedAt?.formatForInformation()}</span>
                        </div>
                    )
                }

                if (row.original.isAllowToConducted()) {
                    return (
                        <Button
                            size="sm"
                            onClick={() => handleOpenLecturerNotesConfirm(row.original.id)}
                        >
                            Masukkan Catatan
                        </Button>
                    )
                }

                return <Badge>Belum masuk minggu pelaksanaan kelas</Badge>
            }
        }
    ];

    return columns;
};
