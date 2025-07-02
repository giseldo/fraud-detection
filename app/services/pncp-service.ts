"use server"

interface PNCPPriceData {
  item: string
  averagePrice: number
  unit: string
  dataSource: string
  lastUpdate: string
}

export async function searchPNCPPrices(itemDescription: string): Promise<PNCPPriceData | null> {
  try {
    // Por enquanto, vamos simular dados do PNCP até conseguirmos a integração real
    // Isso evita erros de rede que podem quebrar a análise

    const mockPrices: Record<string, number> = {
      computador: 2500,
      notebook: 3000,
      impressora: 800,
      monitor: 600,
      teclado: 150,
      mouse: 80,
      mesa: 400,
      cadeira: 300,
      servidor: 15000,
      switch: 1200,
    }

    // Buscar por palavras-chave na descrição
    const description = itemDescription.toLowerCase()
    let foundPrice = null

    for (const [keyword, price] of Object.entries(mockPrices)) {
      if (description.includes(keyword)) {
        foundPrice = price
        break
      }
    }

    if (foundPrice) {
      return {
        item: itemDescription,
        averagePrice: foundPrice,
        unit: "unidade",
        dataSource: "PNCP (simulado)",
        lastUpdate: new Date().toISOString().split("T")[0],
      }
    }

    return null
  } catch (error) {
    console.error("Erro ao consultar PNCP:", error)
    return null
  }
}

export async function extractItemsFromContract(contractText: string): Promise<
  Array<{
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    unit: string
  }>
> {
  const items = []

  try {
    // Padrões mais simples para extrair itens
    const lines = contractText.split("\n")

    for (const line of lines) {
      // Buscar por padrões como "R$ 1.000,00" ou "1000 reais"
      const priceMatch = line.match(/R\$?\s*([\d.,]+)/i)
      if (priceMatch) {
        const priceStr = priceMatch[1].replace(/\./g, "").replace(",", ".")
        const price = Number.parseFloat(priceStr)

        if (!isNaN(price) && price > 0) {
          // Extrair descrição (texto antes do preço)
          const description = line.substring(0, line.indexOf(priceMatch[0])).trim()

          if (description.length > 5) {
            items.push({
              description: description.substring(0, 100), // Limitar tamanho
              quantity: 1,
              unitPrice: price,
              totalPrice: price,
              unit: "unidade",
            })
          }
        }
      }
    }

    return items.slice(0, 5) // Limitar a 5 itens
  } catch (error) {
    console.error("Erro ao extrair itens:", error)
    return []
  }
}
