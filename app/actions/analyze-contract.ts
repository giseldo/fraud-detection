"use server"

import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"
import { searchPNCPPrices, extractItemsFromContract } from "../services/pncp-service"

const priceAnalysisSchema = z.object({
  item: z.string().describe("Descrição do item analisado"),
  contractPrice: z.number().describe("Preço no contrato"),
  marketPrice: z.number().nullable().describe("Preço médio do mercado (PNCP)"),
  priceVariation: z.number().describe("Variação percentual do preço"),
  riskLevel: z.enum(["BAIXO", "MÉDIO", "ALTO", "CRÍTICO"]).describe("Nível de risco do preço"),
  analysis: z.string().describe("Análise detalhada do preço"),
})

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
  priceAnalysis: z.array(priceAnalysisSchema).describe("Análise de preços dos itens"),
  summary: z.string().describe("Resumo geral da análise"),
  recommendations: z.array(z.string()).describe("Recomendações gerais para investigação"),
})

export async function analyzeContract(contractText: string) {
  try {
    // Extrair itens do contrato
    const contractItems = await extractItemsFromContract(contractText)

    // Buscar preços médios no PNCP para cada item
    const priceAnalysis = []
    for (const item of contractItems.slice(0, 5)) {
      // Limitar a 5 itens para não sobrecarregar
      const pncpData = await searchPNCPPrices(item.description)

      let priceVariation = 0
      let riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO" = "BAIXO"
      let analysis = "Preço de mercado não encontrado no PNCP"

      if (pncpData) {
        priceVariation = ((item.unitPrice - pncpData.averagePrice) / pncpData.averagePrice) * 100

        if (priceVariation > 50) {
          riskLevel = "CRÍTICO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado. Possível superfaturamento.`
        } else if (priceVariation > 25) {
          riskLevel = "ALTO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado. Requer investigação.`
        } else if (priceVariation > 10) {
          riskLevel = "MÉDIO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado.`
        } else if (priceVariation < -30) {
          riskLevel = "ALTO"
          analysis = `Preço ${Math.abs(priceVariation).toFixed(1)}% abaixo da média. Possível subfaturamento ou qualidade inferior.`
        } else {
          analysis = `Preço dentro da faixa normal do mercado (${priceVariation > 0 ? "+" : ""}${priceVariation.toFixed(1)}%).`
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
    }

    // Análise geral do contrato com IA
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

        ANÁLISE DE PREÇOS REALIZADA:
        ${priceAnalysis.map((p) => `- ${p.item}: R$ ${p.contractPrice.toFixed(2)} (${p.analysis})`).join("\n")}

        Para cada problema identificado, cite o trecho específico do texto e explique por que é suspeito.
        Considere também a análise de preços acima na sua avaliação geral de risco.

        Contrato para análise:
        ${contractText}
      `,
    })

    // Incluir análise de preços no resultado
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
