"use client"

// Função para carregar PDF.js dinamicamente com fallbacks
async function loadPDFJS() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js só pode ser usado no navegador")
  }

  try {
    const pdfjsLib = await import("pdfjs-dist")

    // Tentar configurar o worker com múltiplos fallbacks
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      const workerUrls = [
        // Fallback 1: jsDelivr CDN
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        // Fallback 2: unpkg CDN
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        // Fallback 3: cdnjs (original)
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
      ]

      // Tentar cada URL até uma funcionar
      for (const workerUrl of workerUrls) {
        try {
          // Testar se a URL está acessível
          const response = await fetch(workerUrl, { method: "HEAD" })
          if (response.ok) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
            console.log(`PDF.js worker carregado de: ${workerUrl}`)
            break
          }
        } catch (error) {
          console.warn(`Falha ao carregar worker de ${workerUrl}:`, error)
          continue
        }
      }

      // Se nenhum CDN funcionou, usar worker inline como último recurso
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        console.warn("Usando worker inline como fallback")
        pdfjsLib.GlobalWorkerOptions.workerSrc = createInlineWorker()
      }
    }

    return pdfjsLib
  } catch (error) {
    console.error("Erro ao carregar PDF.js:", error)
    throw new Error("Não foi possível carregar o processador de PDF")
  }
}

// Criar worker inline como fallback
function createInlineWorker(): string {
  const workerCode = `
    // Worker inline simplificado para PDF.js
    importScripts('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js');
  `

  const blob = new Blob([workerCode], { type: "application/javascript" })
  return URL.createObjectURL(blob)
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Verificar se estamos no navegador
    if (typeof window === "undefined") {
      throw new Error("Extração de PDF só funciona no navegador")
    }

    // Validar arquivo
    if (!file || file.type !== "application/pdf") {
      throw new Error("Arquivo deve ser um PDF válido")
    }

    if (file.size > 50 * 1024 * 1024) {
      // Limite de 50MB
      throw new Error("Arquivo PDF muito grande. Limite: 50MB")
    }

    console.log("Iniciando extração de PDF:", file.name)

    // Carregar PDF.js dinamicamente
    const pdfjsLib = await loadPDFJS()

    // Converter arquivo para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    console.log("Carregando documento PDF...")

    // Carregar o documento PDF com configurações otimizadas
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
    })

    const pdf = await loadingTask.promise

    console.log(`PDF carregado com ${pdf.numPages} páginas`)

    let fullText = ""
    const maxPages = Math.min(pdf.numPages, 50) // Limitar a 50 páginas para performance

    // Extrair texto de cada página
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        console.log(`Processando página ${pageNum}/${maxPages}`)

        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Combinar todos os itens de texto da página
        const pageText = textContent.items
          .map((item: any) => {
            if ("str" in item && item.str.trim()) {
              return item.str.trim()
            }
            return ""
          })
          .filter((text) => text.length > 0)
          .join(" ")

        if (pageText.trim()) {
          fullText += `\n--- Página ${pageNum} ---\n${pageText}\n`
        }

        // Cleanup da página para liberar memória
        page.cleanup()
      } catch (pageError) {
        console.warn(`Erro ao processar página ${pageNum}:`, pageError)
        fullText += `\n--- Página ${pageNum} (erro ao processar) ---\n`
      }
    }

    if (pdf.numPages > maxPages) {
      fullText += `\n--- Nota: Apenas as primeiras ${maxPages} páginas foram processadas ---\n`
    }

    // Cleanup do documento
    pdf.destroy()

    if (!fullText.trim()) {
      throw new Error(
        "Não foi possível extrair texto do PDF. O arquivo pode estar protegido, ser uma imagem escaneada ou estar corrompido.",
      )
    }

    console.log("Extração de PDF concluída com sucesso")
    return fullText.trim()
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error)

    // Mensagens de erro mais específicas
    if (error.message.includes("Invalid PDF")) {
      throw new Error("Arquivo PDF inválido ou corrompido")
    }
    if (error.message.includes("Password")) {
      throw new Error("PDF protegido por senha não é suportado")
    }
    if (error.message.includes("worker")) {
      throw new Error("Erro ao carregar processador de PDF. Tente novamente ou use um arquivo de texto.")
    }

    throw new Error(`Erro ao processar PDF: ${error.message}`)
  }
}

// Função auxiliar para validar se o arquivo é um PDF válido
export function validatePDFFile(file: File): boolean {
  if (!file) return false
  if (file.type !== "application/pdf") return false
  if (file.size === 0) return false
  if (file.size > 50 * 1024 * 1024) return false // 50MB limit
  return true
}

// Função simplificada para obter informações básicas do PDF
export async function getPDFInfo(file: File): Promise<{
  numPages: number
  fileSize: number
  fileName: string
}> {
  try {
    if (!validatePDFFile(file)) {
      throw new Error("Arquivo PDF inválido")
    }

    const pdfjsLib = await loadPDFJS()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const info = {
      numPages: pdf.numPages,
      fileSize: file.size,
      fileName: file.name,
    }

    pdf.destroy()
    return info
  } catch (error) {
    console.error("Erro ao obter informações do PDF:", error)
    throw error
  }
}
