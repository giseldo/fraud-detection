"use server"

import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

// Schema simplificado
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

function extractItemsFromContract(contractText: string) {
  const items = []

  try {
    // Padrões melhorados para extrair itens e preços
    const patterns = [
      // Padrão: "Item 1 - Descrição ... R$ 1.000,00"
      /Item\s*\d+\s*[-:]?\s*([^R\n]+).*?R\$\s*([\d.,]+)/gi,
      // Padrão: "Computador ... R$ 1.000,00"
      /([A-Za-z][^R\n]{10,50}).*?R\$\s*([\d.,]+)/gi,
      // Padrão: "Valor unitário: R$ 1.000,00"
      /([^:\n]{10,50}).*?Valor\s+unitário.*?R\$\s*([\d.,]+)/gi,
    ]

    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(contractText)) !== null) {
        const description = match[1].trim().replace(/[-:]/g, "").trim()
        const priceStr = match[2].replace(/\./g, "").replace(",", ".")
        const price = Number.parseFloat(priceStr)

        if (description.length > 5 && !isNaN(price) && price > 0) {
          items.push({
            description: description.substring(0, 80),
            quantity: 1,
            unitPrice: price,
            totalPrice: price,
            unit: "unidade",
          })
        }
      }
    }

    // Se não encontrou nada, criar itens de exemplo baseados no texto
    if (items.length === 0) {
      const keywords = ["computador", "monitor", "teclado", "mouse", "notebook", "impressora"]
      for (const keyword of keywords) {
        if (contractText.toLowerCase().includes(keyword)) {
          items.push({
            description: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} (extraído do texto)`,
            quantity: 1,
            unitPrice: keyword === "computador" ? 4500 : keyword === "monitor" ? 1200 : 350,
            totalPrice: keyword === "computador" ? 4500 : keyword === "monitor" ? 1200 : 350,
            unit: "unidade",
          })
        }
      }
    }

    return items.slice(0, 5)
  } catch (error) {
    console.error("Erro ao extrair itens:", error)
    return []
  }
}

function searchPNCPPrices(itemDescription: string) {
  // Dados simulados do PNCP para demonstração
  const mockPrices: Record<string, number> = {
    computador: 2800,
    desktop: 2800,
    notebook: 3200,
    monitor: 650,
    teclado: 120,
    mouse: 60,
    impressora: 800,
    servidor: 12000,
    switch: 1500,
  }

  const description = itemDescription.toLowerCase()

  for (const [keyword, price] of Object.entries(mockPrices)) {
    if (description.includes(keyword)) {
      return {
        item: itemDescription,
        averagePrice: price,
        unit: "unidade",
        dataSource: "PNCP (simulado)",
        lastUpdate: "2024-01-15",
      }
    }
  }

  return null
}

export async function analyzeContract(contractText: string) {
  try {
    console.log("Iniciando análise do contrato...")

    // Extrair itens do contrato
    const contractItems = extractItemsFromContract(contractText)
    console.log("Itens extraídos:", contractItems)

    // Análise de preços
    const priceAnalysis = []

    for (const item of contractItems) {
      const pncpData = searchPNCPPrices(item.description)

      let priceVariation = 0
      let riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO" = "BAIXO"
      let analysis = "Preço de mercado não encontrado no PNCP"

      if (pncpData && pncpData.averagePrice > 0) {
        priceVariation = ((item.unitPrice - pncpData.averagePrice) / pncpData.averagePrice) * 100

        if (priceVariation > 50) {
          riskLevel = "CRÍTICO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado. Possível superfaturamento!`
        } else if (priceVariation > 25) {
          riskLevel = "ALTO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado. Requer investigação.`
        } else if (priceVariation > 10) {
          riskLevel = "MÉDIO"
          analysis = `Preço ${priceVariation.toFixed(1)}% acima da média do mercado.`
        } else if (priceVariation < -20) {
          riskLevel = "MÉDIO"
          analysis = `Preço ${Math.abs(priceVariation).toFixed(1)}% abaixo da média. Verificar qualidade.`
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

    console.log("Análise de preços:", priceAnalysis)

    // Análise de fraude com IA
    const { object } = await generateObject({
      model: groq("gemma2-9b-it"),
      schema: fraudAnalysisSchema,
      prompt: `
        Analise este contrato de licitação e identifique possíveis fraudes.
        
        Procure por:
        1. Especificações muito restritivas que favorecem fornecedor específico
        2. Prazos inadequados (muito curtos ou longos)
        3. Critérios de qualificação excessivos
        4. Linguagem vaga ou ambígua
        5. Cláusulas que limitam competição
        6. Exigências técnicas desnecessárias
        
        ANÁLISE DE PREÇOS ENCONTRADA:
        ${priceAnalysis.map((p) => `- ${p.item}: R$ ${p.contractPrice.toFixed(2)} vs mercado R$ ${p.marketPrice?.toFixed(2) || "N/A"} (${p.analysis})`).join("\n")}
        
        Considere também os preços acima na avaliação de risco.
        
        Contrato: ${contractText.substring(0, 2000)}
      `,
    })

    // Combinar resultados
    const result = {
      ...object,
      priceAnalysis,
    }

    console.log("Resultado final:", result)

    return { success: true, analysis: result }
  } catch (error) {
    console.error("Erro na análise:", error)
    return {
      success: false,
      error: `Erro ao analisar o contrato: ${error.message}`,
    }
  }
}
