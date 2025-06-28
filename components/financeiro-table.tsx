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
import { ArrowUpDown, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"

import { Button } from "@/components/ui/button"
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

const data: Transacao[] = [
  {
    id: "1",
    descricao: "Honorários - Processo nº 12345",
    tipo: "receita",
    valor: 5000,
    cliente: "Maria Silva",
    data: "10/01/2023",
    status: "Pago",
  },
  {
    id: "2",
    descricao: "Aluguel do escritório",
    tipo: "despesa",
    valor: 3000,
    cliente: "-",
    data: "05/01/2023",
    status: "Pago",
  },
  {
    id: "3",
    descricao: "Honorários - Processo nº 54321",
    tipo: "receita",
    valor: 4500,
    cliente: "Pedro Lima",
    data: "15/01/2023",
    status: "Pendente",
  },
  {
    id: "4",
    descricao: "Conta de luz",
    tipo: "despesa",
    valor: 450,
    cliente: "-",
    data: "20/01/2023",
    status: "Pago",
  },
  {
    id: "5",
    descricao: "Honorários - Processo nº 13579",
    tipo: "receita",
    valor: 6000,
    cliente: "Ana Costa",
    data: "25/01/2023",
    status: "Pago",
  },
  {
    id: "6",
    descricao: "Material de escritório",
    tipo: "despesa",
    valor: 800,
    cliente: "-",
    data: "28/01/2023",
    status: "Pago",
  },
  {
    id: "7",
    descricao: "Honorários - Processo nº 24680",
    tipo: "receita",
    valor: 3500,
    cliente: "Roberto Ferreira",
    data: "05/02/2023",
    status: "Pendente",
  },
  {
    id: "8",
    descricao: "Internet e telefone",
    tipo: "despesa",
    valor: 350,
    cliente: "-",
    data: "10/02/2023",
    status: "Pago",
  },
  {
    id: "9",
    descricao: "Honorários - Processo nº 97531",
    tipo: "receita",
    valor: 5500,
    cliente: "Carla Oliveira",
    data: "15/02/2023",
    status: "Pago",
  },
  {
    id: "10",
    descricao: "Salário da secretária",
    tipo: "despesa",
    valor: 2500,
    cliente: "-",
    data: "28/02/2023",
    status: "Pago",
  },
]

export type Transacao = {
  id: string
  descricao: string
  tipo: "receita" | "despesa"
  valor: number
  cliente: string
  data: string
  status: "Pago" | "Pendente"
}

export const columns: ColumnDef<Transacao>[] = [
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string
      const icon =
        tipo === "receita" ? (
          <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
        )

      return (
        <div className="flex items-center">
          {icon}
          <span>{row.getValue("descricao")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string
      return <div className={`capitalize ${tipo === "receita" ? "text-green-500" : "text-red-500"}`}>{tipo}</div>
    },
  },
  {
    accessorKey: "valor",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue("valor"))
      const tipo = row.getValue("tipo") as string

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)

      return (
        <div className={`text-right font-medium ${tipo === "receita" ? "text-green-500" : "text-red-500"}`}>
          {formatted}
        </div>
      )
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => <div>{row.getValue("cliente")}</div>,
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("data")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <div className={`font-medium ${status === "Pago" ? "text-green-500" : "text-yellow-500"}`}>{status}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transacao = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transacao.id)}>
              Copiar ID da transação
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Editar transação</DropdownMenuItem>
            {transacao.status === "Pendente" && <DropdownMenuItem>Marcar como pago</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function FinanceiroTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
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
          placeholder="Filtrar por descrição..."
          value={(table.getColumn("descricao")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("descricao")?.setFilterValue(event.target.value)}
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
