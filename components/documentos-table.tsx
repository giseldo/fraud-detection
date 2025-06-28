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
import {
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  FileIcon as FilePdf,
  FileIcon as FileWord,
  FileSpreadsheet,
} from "lucide-react"

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

const data: Documento[] = [
  {
    id: "1",
    nome: "Petição Inicial - Maria Silva",
    tipo: "pdf",
    processo: "12345-67.2023.8.26.0100",
    dataCriacao: "10/01/2023",
    tamanho: "1.2 MB",
  },
  {
    id: "2",
    nome: "Contrato de Prestação de Serviços",
    tipo: "docx",
    processo: "98765-43.2023.8.26.0100",
    dataCriacao: "15/02/2023",
    tamanho: "850 KB",
  },
  {
    id: "3",
    nome: "Acordo de Divórcio",
    tipo: "pdf",
    processo: "54321-89.2023.8.26.0100",
    dataCriacao: "20/03/2023",
    tamanho: "1.5 MB",
  },
  {
    id: "4",
    nome: "Cálculos Trabalhistas",
    tipo: "xlsx",
    processo: "13579-24.2023.8.26.0100",
    dataCriacao: "05/04/2023",
    tamanho: "720 KB",
  },
  {
    id: "5",
    nome: "Procuração - Roberto Ferreira",
    tipo: "pdf",
    processo: "24680-13.2023.8.26.0100",
    dataCriacao: "18/05/2023",
    tamanho: "450 KB",
  },
  {
    id: "6",
    nome: "Modelo de Contestação",
    tipo: "docx",
    processo: "-",
    dataCriacao: "22/06/2023",
    tamanho: "780 KB",
  },
  {
    id: "7",
    nome: "Recurso - Marcelo Souza",
    tipo: "pdf",
    processo: "86420-97.2023.8.26.0100",
    dataCriacao: "10/07/2023",
    tamanho: "1.8 MB",
  },
  {
    id: "8",
    nome: "Certidão de Casamento",
    tipo: "pdf",
    processo: "75309-86.2023.8.26.0100",
    dataCriacao: "15/08/2023",
    tamanho: "2.1 MB",
  },
  {
    id: "9",
    nome: "Contrato de Compra e Venda",
    tipo: "docx",
    processo: "64208-75.2023.8.26.0100",
    dataCriacao: "20/09/2023",
    tamanho: "950 KB",
  },
  {
    id: "10",
    nome: "Relatório de Audiência",
    tipo: "pdf",
    processo: "53197-64.2023.8.26.0100",
    dataCriacao: "05/10/2023",
    tamanho: "1.3 MB",
  },
]

export type Documento = {
  id: string
  nome: string
  tipo: string
  processo: string
  dataCriacao: string
  tamanho: string
}

export const columns: ColumnDef<Documento>[] = [
  {
    accessorKey: "nome",
    header: "Nome do Documento",
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string
      let icon = <FileText className="mr-2 h-4 w-4" />

      if (tipo === "pdf") icon = <FilePdf className="mr-2 h-4 w-4 text-red-500" />
      if (tipo === "docx") icon = <FileWord className="mr-2 h-4 w-4 text-blue-500" />
      if (tipo === "xlsx") icon = <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />

      return (
        <div className="flex items-center">
          {icon}
          <span>{row.getValue("nome")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => <div className="uppercase">{row.getValue("tipo")}</div>,
  },
  {
    accessorKey: "processo",
    header: "Processo",
    cell: ({ row }) => <div>{row.getValue("processo")}</div>,
  },
  {
    accessorKey: "dataCriacao",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data de Criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("dataCriacao")}</div>,
  },
  {
    accessorKey: "tamanho",
    header: "Tamanho",
    cell: ({ row }) => <div>{row.getValue("tamanho")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const documento = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(documento.id)}>
              Copiar ID do documento
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Visualizar</DropdownMenuItem>
            <DropdownMenuItem>Baixar</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Compartilhar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DocumentosTable() {
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
          placeholder="Filtrar por nome do documento..."
          value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("nome")?.setFilterValue(event.target.value)}
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
