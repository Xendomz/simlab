import { ColumnDef } from '@tanstack/react-table';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';

interface ColumnProps {
    openModal: (id?: number) => void;
}

export const AdminColumn = ({ openModal }: ColumnProps): ColumnDef<UserView>[] => [
    { header: 'Email', accessorKey: 'email'},
    { header: 'Nama', accessorKey: 'name'},
    {
        header: 'Action',
        accessorKey: 'id',
        cell: ({row}) => (
            <>
                <Button size={'sm'} onClick={() => openModal(row.original.id)}>
                    Edit
                </Button>
            </>
        )
    },
];
