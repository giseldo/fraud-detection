"use server"

interface PNCPPriceData {
  item: string
  averagePrice: number
  unit: string
  dataSource: string
  lastUpdate: string
}

interface PNCPSearchResult {
  content: Array<{
    codigoItem: string
    descricaoItem: string
    valorMedio: number
    unidadeMedida: string
    dataReferencia: string
  }>
}

export async function searchPNCPPrices(itemDescription: string): Promise<PNCPPriceData | null> {
  try {
    // Endpoint para consulta de preços médios no PNCP
    const searchUrl = `https://pncp.gov.br/api/consulta/v1/precos-medios`

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Adicionar parâmetros de busca baseados na descrição do item
    })

    if (!response.ok) {
      console.warn(`PNCP API error: ${response.status}`)
      return null
    }

    const data: PNCPSearchResult = await response.json()

    if (data.content && data.content.length > 0) {
      const firstResult = data.content[0]
      return {
        item: firstResult.descricaoItem,
        averagePrice: firstResult.valorMedio,
        unit: firstResult.unidadeMedida,
        dataSource: "PNCP",
        lastUpdate: firstResult.dataReferencia,
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
  // Regex patterns para extrair itens, quantidades e preços
  const itemPatterns = [
    /(\d+)\s*[-.]?\s*([^:]+):\s*R?\$?\s*([\d.,]+)/gi,
    /item\s*(\d+)[:\s]*([^-\n]+)[-\s]*R?\$?\s*([\d.,]+)/gi,
    /(\d+)\s*unidades?\s*de\s*([^-\n]+)[-\s]*R?\$?\s*([\d.,]+)/gi,
  ]

  const items: Array<{
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    unit: string
  }> = []

  for (const pattern of itemPatterns) {
    let match
    while ((match = pattern.exec(contractText)) !== null) {
      const quantity = Number.parseInt(match[1]) || 1
      const description = match[2].trim()
      const priceStr = match[3].replace(/[.,]/g, (match) => (match === "," ? "." : ""))
      const price = Number.parseFloat(priceStr)

      if (description && !isNaN(price)) {
        items.push({
          description,
          quantity,
          unitPrice: price / quantity,
          totalPrice: price,
          unit: "unidade",
        })
      }
    }
  }

  return items
}
