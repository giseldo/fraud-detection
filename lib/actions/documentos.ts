"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDocumentos() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentos")
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
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar documentos:", error)
    return []
  }

  return data
}

export async function getDocumentoById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("documentos")
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
    console.error("Erro ao buscar documento:", error)
    return null
  }

  return data
}

export async function createDocumento(formData: FormData) {
  const supabase = createClient()

  const documento = {
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
    caminho_arquivo: (formData.get("caminho_arquivo") as string) || null,
    tamanho: (formData.get("tamanho") as string) || null,
    descricao: (formData.get("descricao") as string) || null,
  }

  const { error } = await supabase.from("documentos").insert([documento])

  if (error) {
    console.error("Erro ao criar documento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/documentos")
  return { success: true }
}

export async function updateDocumento(id: string, formData: FormData) {
  const supabase = createClient()

  const documento = {
    nome: formData.get("nome") as string,
    tipo: formData.get("tipo") as string,
    processo_id: (formData.get("processo_id") as string) || null,
    cliente_id: (formData.get("cliente_id") as string) || null,
    caminho_arquivo: (formData.get("caminho_arquivo") as string) || null,
    tamanho: (formData.get("tamanho") as string) || null,
    descricao: (formData.get("descricao") as string) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("documentos").update(documento).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar documento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/documentos")
  revalidatePath(`/documentos/${id}`)
  return { success: true }
}

export async function deleteDocumento(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("documentos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir documento:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/documentos")
  return { success: true }
}
