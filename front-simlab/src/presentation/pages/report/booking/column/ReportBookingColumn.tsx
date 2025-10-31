import { ColumnDef } from '@tanstack/react-table';
import { BookingView } from '@/application/booking/BookingView';
// import { BookingStatus } from '@/domain/booking/BookingStatus';
// import { BookingType } from '@/domain/booking/BookingType';
// import { Badge } from '@/presentation/components/ui/badge';
// import { Button } from '@/presentation/components/ui/button';
// import { NavLink } from 'react-router-dom';

export const ReportBookingColumn = (): ColumnDef<BookingView>[] => [
    // { header: 'Tahun Akademik', accessorKey: 'academicYear', cell: ({ row }) => row.original.academicYear?.academicYear },
    // {
    //     header: 'Identitas Peminjam', accessorKey: 'user',
    //     cell: ({ row }) => (
    //         <div className='flex flex-col'>
    //             <span className='font-semibold'>{row.original.user?.name} | {row.original.user?.identityNum}</span>
    //             <span className='text-sm'>Prodi: {row.original.user?.studyProgram?.name}</span>
    //         </div>
    //     )
    // },
    // {
    //     header: 'Kebutuhan', accessorKey: 'purpose',
    //     cell: ({ row }) => (
    //         <div className='flex flex-col'>
    //             <span className='font-semibold'>{ row.original.purpose }</span>
    //             <span className='text-sm'>Judul: { row.original.activityName }</span>
    //         </div>
    //     )
    // },
    // {
    //     header: 'Waktu', accessorKey: 'startTime', cell: ({ row }) => (
    //         <Badge variant={'secondary'}>{row.original.startTime.formatForInformation()} | {row.original.endTime.formatForInformation()}</Badge>
    //     )
    // },
    // {
    //     header: 'Jenis', accessorKey: 'bookingType', cell: ({ row }) => {
    //         let text = '';
    //         switch (row.original.bookingType) {
    //             case BookingType.Room: text = 'Peminjaman Ruangan'; break;
    //             case BookingType.RoomNEquipment: text = 'Peminjaman Ruangan dan Alat'; break;
    //             case BookingType.Equipment: text = 'Peminjaman Alat'; break;
    //         }
    //         return <Badge>{text}</Badge>;
    //     }
    // },
    // {
    //     header: 'Status', accessorKey: 'status', cell: ({ row }) => {
    //         const status = row.original.status;
    //         const base = 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit';
    //         if (status === BookingStatus.Draft) return <div className={base + ' bg-slate-100'}>Draft</div>;
    //         if (status === BookingStatus.Pending) return <div className={base + ' bg-sky-100'}>Pending</div>;
    //         if (status === BookingStatus.Approved) return <div className={base + ' bg-emerald-100'}>Approved</div>;
    //         if (status === BookingStatus.Rejected) return <div className={base + ' bg-red-100'}>Rejected</div>;
    //         return null;
    //     }
    // },
    // {
    //     header: 'Action', accessorKey: 'id', cell: ({ row }) => (
    //         <NavLink to={`/panel/peminjaman/${row.original.id}/detail`}>
    //             <Button size="sm" variant="secondary">Detail</Button>
    //         </NavLink>
    //     )
    // }
];
