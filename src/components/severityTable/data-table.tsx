"use client"

import React, { useState } from "react"

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "../ui/input"
import { AuthorCombobox } from "./author-combobox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [selectedSeverity, setSelectedSeverity] = useState<string>("")

    const handleSelect = (value: string) => {
        setSelectedSeverity(value)
        table.getColumn("severity")?.setFilterValue(value)
    }

  
    const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        sorting,
        columnFilters
    }
  })

  return (
    <div>
        <div className="flex items-center py-4">
            <div className="mr-3.5">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Input 
                            placeholder="Filter severity..."
                            value={selectedSeverity}
                            onChange={(e) => {
                                const val = e.target.value
                                setSelectedSeverity(val)
                                table.getColumn("severity")?.setFilterValue(val)
                            }}
                            className="max-w-sm mr-3 cursor-pointer"
                            readOnly
                        />
                    </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Select severity status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => handleSelect("")}>
                                    ALL
                                </DropdownMenuItem>
                                {["CRITICAL", "IMPORTANT", "OK"].map((level) => (
                                <DropdownMenuItem key={level} onSelect={() => handleSelect(level)}>
                                    {level}
                                </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <AuthorCombobox/>
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  )
}