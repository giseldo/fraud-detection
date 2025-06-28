export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          cpf_cnpj: string | null
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          observacoes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          cpf_cnpj?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          observacoes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          cpf_cnpj?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          observacoes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      processos: {
        Row: {
          id: string
          numero: string
          cliente_id: string
          tipo: string
          descricao: string | null
          vara: string | null
          comarca: string | null
          status: string
          data_inicio: string | null
          data_conclusao: string | null
          valor: number | null
          honorarios: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero: string
          cliente_id: string
          tipo: string
          descricao?: string | null
          vara?: string | null
          comarca?: string | null
          status?: string
          data_inicio?: string | null
          data_conclusao?: string | null
          valor?: number | null
          honorarios?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero?: string
          cliente_id?: string
          tipo?: string
          descricao?: string | null
          vara?: string | null
          comarca?: string | null
          status?: string
          data_inicio?: string | null
          data_conclusao?: string | null
          valor?: number | null
          honorarios?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          nome: string
          tipo: string
          processo_id: string | null
          cliente_id: string | null
          caminho_arquivo: string | null
          tamanho: string | null
          descricao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          tipo: string
          processo_id?: string | null
          cliente_id?: string | null
          caminho_arquivo?: string | null
          tamanho?: string | null
          descricao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string
          processo_id?: string | null
          cliente_id?: string | null
          caminho_arquivo?: string | null
          tamanho?: string | null
          descricao?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          data_inicio: string
          data_fim: string | null
          local: string | null
          tipo: string
          processo_id: string | null
          cliente_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          data_inicio: string
          data_fim?: string | null
          local?: string | null
          tipo: string
          processo_id?: string | null
          cliente_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          data_inicio?: string
          data_fim?: string | null
          local?: string | null
          tipo?: string
          processo_id?: string | null
          cliente_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transacoes: {
        Row: {
          id: string
          descricao: string
          tipo: string
          valor: number
          data: string
          status: string
          processo_id: string | null
          cliente_id: string | null
          categoria: string | null
          metodo_pagamento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          descricao: string
          tipo: string
          valor: number
          data: string
          status?: string
          processo_id?: string | null
          cliente_id?: string | null
          categoria?: string | null
          metodo_pagamento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          descricao?: string
          tipo?: string
          valor?: number
          data?: string
          status?: string
          processo_id?: string | null
          cliente_id?: string | null
          categoria?: string | null
          metodo_pagamento?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          nome: string
          cargo: string | null
          telefone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          cargo?: string | null
          telefone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          cargo?: string | null
          telefone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
