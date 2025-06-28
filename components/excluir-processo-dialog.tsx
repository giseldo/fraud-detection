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
import { deleteProcesso } from "@/lib/actions/processos"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ExcluirProcessoDialogProps {
  children: React.ReactNode
  id: string
  numero: string
}

export function ExcluirProcessoDialog({ children, id, numero }: ExcluirProcessoDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleDelete() {
    setIsSubmitting(true)

    try {
      const result = await deleteProcesso(id)

      if (result.success) {
        toast({
          title: "Processo excluído com sucesso",
          description: "O processo foi removido do sistema.",
        })
        setOpen(false)
      } else {
        toast({
          title: "Erro ao excluir processo",
          description: result.error || "Ocorreu um erro ao excluir o processo.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir processo",
        description: "Ocorreu um erro ao excluir o processo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Processo</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o processo <span className="font-semibold">{numero}</span>? Esta ação não
            pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
