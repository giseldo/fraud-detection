"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getClientes() {
  const supabase = createClient()

  const { data, error } = await supabase.from("clientes").select("*").order("nome")

  if (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }

  return data
}

export async function getClienteById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single()

  if (error) {
    console.error("Erro ao buscar cliente:", error)
    return null
  }

  return data
}

export async function createCliente(formData: FormData) {
  const supabase = createClient()

  const cliente = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    cpf_cnpj: formData.get("cpf_cnpj") as string,
    endereco: formData.get("endereco") as string,
    cidade: formData.get("cidade") as string,
    estado: formData.get("estado") as string,
    cep: formData.get("cep") as string,
    observacoes: formData.get("observacoes") as string,
    status: "Ativo",
  }

  const { error } = await supabase.from("clientes").insert([cliente])

  if (error) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/clientes")
  return { success: true }
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = createClient()

  const cliente = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    cpf_cnpj: formData.get("cpf_cnpj") as string,
    endereco: formData.get("endereco") as string,
    cidade: formData.get("cidade") as string,
    estado: formData.get("estado") as string,
    cep: formData.get("cep") as string,
    observacoes: formData.get("observacoes") as string,
    status: formData.get("status") as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("clientes").update(cliente).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar cliente:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/clientes")
  revalidatePath(`/clientes/${id}`)
  return { success: true }
}

export async function deleteCliente(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("clientes").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir cliente:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/clientes")
  return { success: true }
}
