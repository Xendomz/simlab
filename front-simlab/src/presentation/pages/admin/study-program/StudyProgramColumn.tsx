import { ColumnDef } from "@tanstack/react-table";
import { StudyProgram } from "../../../../domain/study-program/StudyProgram";
import { Button } from "@/presentation/components/ui/button";

interface ColumnProps {
    openModal: (type: 'Add' | 'Edit', id?: number) => void;
    openConfirm: (id: number) => void;
}

export const StudyProgramColumn = ({ openModal, openConfirm }: ColumnProps): ColumnDef<StudyProgram>[] => [
    { header: 'Prodi', accessorKey: 'name' as keyof StudyProgram },
    {
        header: 'Jurusan',
        accessorKey: 'major' as keyof StudyProgram,
        cell: ({ row }) => row.original.major?.name
    },
    {
        header: 'Action',
        accessorKey: 'id' as keyof StudyProgram,
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size={"sm"} variant={'warning'} onClick={() => openModal('Edit',row.original.id)}>
                    Edit
                </Button>
                <Button size={"sm"} variant={"destructive"} onClick={() => openConfirm(row.original.id)}>
                    Delete
                </Button>
            </div>
        )
    },
];
