'use client'

import { ScanSeverityRow } from "@/schema"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"


const severityColors: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-800',
  IMPORTANT: 'bg-yellow-100 text-yellow-800',
  OK: 'bg-green-100 text-green-800',
}

export const columns: ColumnDef<ScanSeverityRow>[] = [
  {
    accessorKey: "commitMessage",
    header: "Commit",
  },
  {
    accessorKey: "commitAuthor",
    header: "Author",
  },
  {
    accessorKey: "severity",
    header: ({column}) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="cursor-pointer">
          Severity
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
    cell: ({row}) => {
      return (<Badge className={cn(severityColors[row.original.severity], 'border px-2 py-1')}>
        {row.original.severity}
      </Badge>)
    }
  },
]
