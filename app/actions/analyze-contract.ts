"use server"

import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

const fraudAnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100).describe("Pontuação de risco de fraude de 0 a 100"),
  riskLevel: z.enum(["BAIXO", "MÉDIO", "ALTO", "CRÍTICO"]).describe("Nível de risco categorizado"),
  suspiciousPatterns: z
    .array(
      z.object({
        pattern: z.string().describe("Tipo de padrão suspeito identificado"),
        description: z.string().describe("Descrição detalhada do problema"),
        textSnippet: z.string().describe("Trecho específico do texto que contém o problema"),
        severity: z.enum(["BAIXA", "MÉDIA", "ALTA", "CRÍTICA"]).describe("Gravidade do problema"),
        recommendation: z.string().describe("Recomendação para investigação"),
      }),
    )
    .describe("Lista de padrões suspeitos encontrados"),
  summary: z.string().describe("Resumo geral da análise"),
  recommendations: z.array(z.string()).describe("Recomendações gerais para investigação"),
})

export async function analyzeContract(contractText: string) {
  try {
    const { object } = await generateObject({
      model: groq("gemma2-9b-it"),
      schema: fraudAnalysisSchema,
      prompt: `
        Analise o seguinte contrato de licitação em busca de possíveis indicadores de fraude ou irregularidades.
        
        Procure por:
        1. Especificações muito restritivas que favoreçam um fornecedor específico
        2. Prazos inadequados (muito curtos ou muito longos)
        3. Valores desproporcionais ao mercado
        4. Critérios de qualificação excessivos ou inadequados
        5. Linguagem vaga ou ambígua
        6. Ausência de informações essenciais
        7. Cláusulas que limitam a competição
        8. Exigências técnicas desnecessárias
        9. Critérios de julgamento inadequados
        10. Qualquer outro padrão suspeito

        Para cada problema identificado, cite o trecho específico do texto e explique por que é suspeito.

        Contrato para análise:
        ${contractText}
      `,
    })

    return { success: true, analysis: object }
  } catch (error) {
    console.error("Erro na análise:", error)
    return {
      success: false,
      error: "Erro ao analisar o contrato. Tente novamente.",
    }
  }
}
