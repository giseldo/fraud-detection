"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EditarProcessoDialog } from "./editar-processo-dialog"
import { ExcluirProcessoDialog } from "./excluir-processo-dialog"
import type { Database } from "@/lib/supabase/database.types"

export type Processo = Database["public"]["Tables"]["processos"]["Row"] & {
  clientes?: { id: string; nome: string } | null
}

interface ProcessosTableProps {
  processos: Processo[]
}

export const columns: ColumnDef<Processo>[] = [
  {
    accessorKey: "numero",
    header: "Número do Processo",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("numero")}</div>,
  },
  {
    accessorKey: "clientes.nome",
    header: "Cliente",
    cell: ({ row }) => {
      const processo = row.original
      const cliente = processo.clientes
      return <div>{cliente?.nome || "Cliente não encontrado"}</div>
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <div>{row.getValue("tipo")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default"

      if (status === "Concluído") badgeVariant = "secondary"
      if (status === "Urgente") badgeVariant = "destructive"
      if (status === "Aguardando") badgeVariant = "outline"

      return <Badge variant={badgeVariant}>{status}</Badge>
    },
  },
  {
    accessorKey: "data_inicio",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data de Início
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("data_inicio") as string
      return <div>{data ? new Date(data).toLocaleDateString("pt-BR") : "N/A"}</div>
    },
  },
  {
    accessorKey: "honorarios",
    header: () => <div className="text-right">Honorários</div>,
    cell: ({ row }) => {
      const honorarios = row.getValue("honorarios") as number
      if (!honorarios) return <div className="text-right">-</div>

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(honorarios)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const processo = row.original

      return (
        <div className="flex items-center justify-end gap-2">
          <EditarProcessoDialog processo={processo}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Editar processo</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </EditarProcessoDialog>

          <ExcluirProcessoDialog id={processo.id} numero={processo.numero}>
            <Button variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
              <span className="sr-only">Excluir processo</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </ExcluirProcessoDialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(processo.id)}>
                Copiar ID do processo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem>Ver documentos</DropdownMenuItem>
              <DropdownMenuItem>Agendar audiência</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function ProcessosTable({ processos }: ProcessosTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: processos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por número do processo..."
          value={(table.getColumn("numero")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("numero")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Próximo
        </Button>
      </div>
    </div>
  )
}
