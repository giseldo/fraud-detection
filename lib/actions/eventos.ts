"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getEventos() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("eventos")
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
    .order("data_inicio")

  if (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }

  return data
}

export async function getEventoById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("eventos")
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
    console.error("Erro ao buscar evento:", error)
    return null
  }

  return data
}

export async function createEvento(formData: FormData) {
  const supabase = createClient()

  const evento = {
    titulo: formData.get("titulo") as string,
    descricao: (formData.get("descricao") as string) || null,
    data_inicio: formData.get("data_inicio") as string,
    data_fim: (formData.get("data_fim") as string) || null,
    local: (formData.get("local") as string) || null,
    tipo: formData.get("tipo") as string,
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
  }

  const { error } = await supabase.from("eventos").insert([evento])

  if (error) {
    console.error("Erro ao criar evento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/agenda")
  return { success: true }
}

export async function updateEvento(id: string, formData: FormData) {
  const supabase = createClient()

  const evento = {
    titulo: formData.get("titulo") as string,
    descricao: (formData.get("descricao") as string) || null,
    data_inicio: formData.get("data_inicio") as string,
    data_fim: (formData.get("data_fim") as string) || null,
    local: (formData.get("local") as string) || null,
    tipo: formData.get("tipo") as string,
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("eventos").update(evento).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar evento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/agenda")
  return { success: true }
}

export async function deleteEvento(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("eventos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir evento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/agenda")
  return { success: true }
}
