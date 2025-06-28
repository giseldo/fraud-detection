"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTransacoes() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("transacoes")
    .select(`
      *,
      processos (
        id,
        numero
      ),
      clientes (
        id,
        nome
      )
    `)
    .order("data", { ascending: false })

  if (error) {
    console.error("Erro ao buscar transações:", error)
    return []
  }

  return data
}

export async function getTransacaoById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("transacoes")
    .select(`
      *,
      processos (
        id,
        numero
      ),
      clientes (
        id,
        nome
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Erro ao buscar transação:", error)
    return null
  }

  return data
}

export async function createTransacao(formData: FormData) {
  const supabase = createClient()

  const transacao = {
    descricao: formData.get("descricao") as string,
    tipo: formData.get("tipo") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    data: formData.get("data") as string,
    status: (formData.get("status") as string) || "Pendente",
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
    categoria: (formData.get("categoria") as string) || null,
    metodo_pagamento: (formData.get("metodo_pagamento") as string) || null,
  }

  const { error } = await supabase.from("transacoes").insert([transacao])

  if (error) {
    console.error("Erro ao criar transação:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/financeiro")
  return { success: true }
}

export async function updateTransacao(id: string, formData: FormData) {
  const supabase = createClient()

  const transacao = {
    descricao: formData.get("descricao") as string,
    tipo: formData.get("tipo") as string,
    valor: Number.parseFloat(formData.get("valor") as string),
    data: formData.get("data") as string,
    status: formData.get("status") as string,
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
    categoria: (formData.get("categoria") as string) || null,
    metodo_pagamento: (formData.get("metodo_pagamento") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("transacoes").update(transacao).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar transação:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/financeiro")
  return { success: true }
}

export async function deleteTransacao(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("transacoes").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir transação:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/financeiro")
  return { success: true }
}
