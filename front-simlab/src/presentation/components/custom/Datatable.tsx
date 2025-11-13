"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/presentation/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    loading: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading
}: DataTableProps<TData, TValue>) {
    const numbers: number[] = []
    for (let i = 0; i < data.length; i++) {
        numbers[i] = i + 1
    }

    const col = ([] as ColumnDef<TData, TValue>[]).concat(columns)
    // add number column at first
    col.unshift({
        accessorKey: 'row_num',
        header: () => <div>#</div>,
        cell: ({ row }) => {
            return <div>{numbers[row.index]}</div>
        },
    })

    const table = useReactTable({
        data,
        columns: col,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="whitespace-normal">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ?
                        (
                            <TableRow>
                                <TableCell colSpan={col.length} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="whitespace-normal">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={col.length} className="text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        )}

                </TableBody>
            </Table>
        </div>
    )
}