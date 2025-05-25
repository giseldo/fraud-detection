"use server"

import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { searchPNCPPrices, extractItemsFromContract } from "../services/pncp-service"

// Schema simplificado para evitar erros
const fraudAnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["BAIXO", "MÉDIO", "ALTO", "CRÍTICO"]),
  suspiciousPatterns: z.array(
    z.object({
      pattern: z.string(),
      description: z.string(),
      textSnippet: z.string(),
      severity: z.enum(["BAIXA", "MÉDIA", "ALTA", "CRÍTICA"]),
      recommendation: z.string(),
    }),
  ),
  summary: z.string(),
  recommendations: z.array(z.string()),
})

export async function analyzeContract(contractText: string) {
  try {
    // Primeiro, fazer a análise básica de fraude
    const { object } = await generateObject({
      model: groq("gemma2-9b-it"),
      schema: fraudAnalysisSchema,
      prompt: `
        Analise este contrato de licitação e identifique possíveis fraudes.
        
        Procure por:
        1. Especificações muito restritivas
        2. Prazos inadequados
        3. Critérios de qualificação excessivos
        4. Linguagem vaga
        5. Cláusulas que limitam competição
        6. Exigências técnicas desnecessárias
        
        Retorne APENAS dados estruturados conforme o schema.
        
        Contrato: ${contractText.substring(0, 3000)}
      `,
    })

    // Depois, fazer análise de preços separadamente
    const priceAnalysis = []
    try {
      const contractItems = await extractItemsFromContract(contractText)

      for (const item of contractItems.slice(0, 3)) {
        try {
          const pncpData = await searchPNCPPrices(item.description)

          let priceVariation = 0
          let riskLevel = "BAIXO"
          let analysis = "Preço de mercado não encontrado no PNCP"

          if (pncpData && pncpData.averagePrice > 0) {
            priceVariation = ((item.unitPrice - pncpData.averagePrice) / pncpData.averagePrice) * 100

            if (priceVariation > 50) {
              riskLevel = "CRÍTICO"
              analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado`
            } else if (priceVariation > 25) {
              riskLevel = "ALTO"
              analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado`
            } else if (priceVariation > 10) {
              riskLevel = "MÉDIO"
              analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado`
            } else {
              analysis = `Preço dentro da faixa normal (${priceVariation > 0 ? "+" : ""}${priceVariation.toFixed(1)}%)`
            }
          }

          priceAnalysis.push({
            item: item.description,
            contractPrice: item.unitPrice,
            marketPrice: pncpData?.averagePrice || null,
            priceVariation,
            riskLevel,
            analysis,
          })
        } catch (itemError) {
          console.warn("Erro ao analisar item:", itemError)
        }
      }
    } catch (priceError) {
      console.warn("Erro na análise de preços:", priceError)
    }

    // Combinar resultados
    const result = {
      ...object,
      priceAnalysis,
    }

    return { success: true, analysis: result }
  } catch (error) {
    console.error("Erro na análise:", error)
    return {
      success: false,
      error: "Erro ao analisar o contrato. Tente novamente.",
    }
  }
}
