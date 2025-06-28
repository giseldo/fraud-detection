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
import { createProcesso } from "@/lib/actions/processos"
import { getClientes } from "@/lib/actions/clientes"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Cliente } from "./clientes-table"

export function NovoProcessoDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState("")
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

      const result = await createProcesso(formData)

      if (result.success) {
        toast({
          title: "Processo criado com sucesso",
          description: "O processo foi adicionado ao sistema.",
        })
        setOpen(false)
        setSelectedCliente("")
      } else {
        toast({
          title: "Erro ao criar processo",
          description: result.error || "Ocorreu um erro ao criar o processo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao criar processo",
        description: "Ocorreu um erro ao criar o processo.",
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
            <DialogTitle>Novo Processo</DialogTitle>
            <DialogDescription>Adicione um novo processo ao sistema.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Processo</Label>
                <Input id="numero" name="numero" required placeholder="Ex: 12345-67.2023.8.26.0100" />
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
                <Select name="tipo" required>
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
                <Select name="status" defaultValue="Em andamento">
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
              <Textarea id="descricao" name="descricao" placeholder="Descreva o processo..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vara">Vara</Label>
                <Input id="vara" name="vara" placeholder="Ex: 5ª Vara do Trabalho" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comarca">Comarca</Label>
                <Input id="comarca" name="comarca" placeholder="Ex: São Paulo" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input id="data_inicio" name="data_inicio" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor da Causa</Label>
                <Input id="valor" name="valor" type="number" step="0.01" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorarios">Honorários</Label>
                <Input id="honorarios" name="honorarios" type="number" step="0.01" placeholder="0,00" />
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
