"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProcessos() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("processos")
      .select(`
        *,
        clientes!inner (
          id,
          nome
        )
      `)
      .order("data_inicio", { ascending: false })

    if (error) {
      console.error("Erro ao buscar processos:", error)
      return []
    }

    return data || []
  } catch (err) {
    console.error("Erro na função getProcessos:", err)
    return []
  }
}

export async function getProcessoById(id: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("processos")
      .select(`
        *,
        clientes!inner (
          id,
          nome,
          email,
          telefone
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erro ao buscar processo:", error)
      return null
    }

    return data
  } catch (err) {
    console.error("Erro na função getProcessoById:", err)
    return null
  }
}

export async function createProcesso(formData: FormData) {
  const supabase = createClient()

  const processo = {
    numero: formData.get("numero") as string,
    cliente_id: formData.get("cliente_id") as string,
    tipo: formData.get("tipo") as string,
    descricao: formData.get("descricao") as string,
    vara: formData.get("vara") as string,
    comarca: formData.get("comarca") as string,
    status: (formData.get("status") as string) || "Em andamento",
    data_inicio: formData.get("data_inicio") as string,
    data_conclusao: (formData.get("data_conclusao") as string) || null,
    valor: Number.parseFloat(formData.get("valor") as string) || null,
    honorarios: Number.parseFloat(formData.get("honorarios") as string) || null,
  }

  const { error } = await supabase.from("processos").insert([processo])

  if (error) {
    console.error("Erro ao criar processo:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/processos")
  return { success: true }
}

export async function updateProcesso(id: string, formData: FormData) {
  const supabase = createClient()

  const processo = {
    numero: formData.get("numero") as string,
    cliente_id: formData.get("cliente_id") as string,
    tipo: formData.get("tipo") as string,
    descricao: formData.get("descricao") as string,
    vara: formData.get("vara") as string,
    comarca: formData.get("comarca") as string,
    status: formData.get("status") as string,
    data_inicio: formData.get("data_inicio") as string,
    data_conclusao: (formData.get("data_conclusao") as string) || null,
    valor: Number.parseFloat(formData.get("valor") as string) || null,
    honorarios: Number.parseFloat(formData.get("honorarios") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("processos").update(processo).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar processo:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/processos")
  revalidatePath(`/processos/${id}`)
  return { success: true }
}

export async function deleteProcesso(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("processos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir processo:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/processos")
  return { success: true }
}
