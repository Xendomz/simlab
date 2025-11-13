import React from 'react'
import { DataTable } from './custom/Datatable';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { RefreshCwIcon } from 'lucide-react';

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    pagination?: boolean;
    pageSize?: number;
    cellClassName?: string;
    onRowClick?: (row: T, index: number) => void;
    loading: boolean;
    emptyMessage?: string;
    searchTerm: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    perPage: number;
    handlePerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    totalPages: number;
    totalItems: number;
    currentPage: number;
    handlePageChange: (page: number) => void;
    handleRefresh?: () => void
}

const Table = <T,>({
    data,
    columns,
    searchTerm,
    handleSearch,
    perPage,
    handlePerPageChange,
    totalPages,
    totalItems,
    currentPage,
    handlePageChange,
    loading,
    handleRefresh
}: TableProps<T>) => {


    const renderPaginationButtons = () => {
        const buttons = []
        const maxButtonsToShow = 5

        // Always show first page
        buttons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary/50 hover:text-white'}`}
            >
                1
            </button>
        )

        // Calculate range of buttons to show
        const startPage = Math.max(2, currentPage - Math.floor(maxButtonsToShow / 2))
        const endPage = Math.min(totalPages - 1, startPage + maxButtonsToShow - 3)

        // Adjust if we're near the beginning
        if (startPage > 2) {
            buttons.push(<span key="ellipsis1" className="px-2">...</span>)
        }

        // Middle buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary/50 hover:text-white'}`}
                >
                    {i}
                </button>
            )
        }

        // Ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            buttons.push(<span key="ellipsis2" className="px-2">...</span>)
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            buttons.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary/50 hover:text-white'}`}
                >
                    {totalPages}
                </button>
            )
        }

        return buttons
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-between mb-5">
                <div className="w-full md:w-1/3">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <svg
                            className="absolute w-5 h-5 text-gray-400 right-3 top-2.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
                
                <div className="flex items-center mt-4 space-x-2 md:mt-0">
                    <span className="text-sm text-gray-600">Show:</span>
                    <Select name='show_data' value={perPage !== null ? String(perPage) : ''} onValueChange={(value) =>
                        handlePerPageChange({
                            target: {
                                name: 'show_data',
                                value: value
                            }
                        } as React.ChangeEvent<HTMLSelectElement>)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jurusan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Show</SelectLabel>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    
                    {handleRefresh && (
                        <Button variant={'outline'} onClick={handleRefresh}><RefreshCwIcon/></Button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                />
            </div>

            <div className="flex flex-col items-center justify-between mt-6 md:flex-row">
                <div className="mb-4 text-sm text-gray-600 md:mb-0">
                    Showing <span className="font-medium">{data.length}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> items
                </div>

                <div className="flex flex-wrap justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    <div className="flex mx-1">
                        {renderPaginationButtons()}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}

export default Table
