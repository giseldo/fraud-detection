"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProcesso } from "@/lib/actions/processos"
import { getClientes } from "@/lib/actions/clientes"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "./clientes-table"
import type { Processo } from "./processos-table"

interface EditarProcessoDialogProps {
  children: React.ReactNode
  processo: Processo
}

export function EditarProcessoDialog({ children, processo }: EditarProcessoDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState(processo.cliente_id)
  const { toast } = useToast()

  useEffect(() => {
    async function loadClientes() {
      const clientesData = await getClientes()
      setClientes(clientesData)
    }
    if (open) {
      loadClientes()
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      formData.set("cliente_id", selectedCliente)

      const result = await updateProcesso(processo.id, formData)

      if (result.success) {
        toast({
          title: "Processo atualizado com sucesso",
          description: "As informações do processo foram atualizadas.",
        })
        setOpen(false)
      } else {
        toast({
          title: "Erro ao atualizar processo",
          description: result.error || "Ocorreu um erro ao atualizar o processo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar processo",
        description: "Ocorreu um erro ao atualizar o processo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Processo</DialogTitle>
            <DialogDescription>Atualize as informações do processo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Processo</Label>
                <Input id="numero" name="numero" defaultValue={processo.numero} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={selectedCliente} onValueChange={setSelectedCliente} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Processo</Label>
                <Select name="tipo" defaultValue={processo.tipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Cível">Cível</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                    <SelectItem value="Família">Família</SelectItem>
                    <SelectItem value="Consumidor">Consumidor</SelectItem>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Imobiliário">Imobiliário</SelectItem>
                    <SelectItem value="Inventário">Inventário</SelectItem>
                    <SelectItem value="Divórcio">Divórcio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={processo.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Aguardando">Aguardando</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" defaultValue={processo.descricao || ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vara">Vara</Label>
                <Input id="vara" name="vara" defaultValue={processo.vara || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comarca">Comarca</Label>
                <Input id="comarca" name="comarca" defaultValue={processo.comarca || ""} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  name="data_inicio"
                  type="date"
                  defaultValue={processo.data_inicio ? new Date(processo.data_inicio).toISOString().split("T")[0] : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Causa</Label>
                <Input id="valor" name="valor" type="number" step="0.01" defaultValue={processo.valor || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorarios">Honorários</Label>
                <Input
                  id="honorarios"
                  name="honorarios"
                  type="number"
                  step="0.01"
                  defaultValue={processo.honorarios || ""}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
