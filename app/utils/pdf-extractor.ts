"use client"

// Função para carregar PDF.js com versão compatível
async function loadPDFJS() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js só pode ser usado no navegador")
  }

  try {
    // Carregar PDF.js
    const pdfjsLib = await import("pdfjs-dist")
    console.log("PDF.js carregado, versão:", pdfjsLib.version)

    // Configurar worker com versão compatível
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      try {
        // Usar a mesma versão da biblioteca carregada
        const version = pdfjsLib.version || "latest"

        // Lista de CDNs para tentar, usando a versão correta
        const workerUrls = [
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`,
          `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`,
          // Fallback para latest se a versão específica não funcionar
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/build/pdf.worker.min.js`,
          `https://unpkg.com/pdfjs-dist@latest/build/pdf.worker.min.js`,
        ]

        let workerLoaded = false

        for (const workerUrl of workerUrls) {
          try {
            console.log(`Tentando worker: ${workerUrl}`)

            // Testar se a URL está acessível
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000) // 3s timeout

            const response = await fetch(workerUrl, {
              method: "HEAD",
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (response.ok) {
              pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl
              console.log(`Worker configurado: ${workerUrl}`)
              workerLoaded = true
              break
            }
          } catch (error) {
            console.warn(`Falha no worker ${workerUrl}:`, error)
            continue
          }
        }

        // Se nenhum worker funcionou, tentar modo sem worker
        if (!workerLoaded) {
          console.warn("Nenhum worker disponível, tentando modo sem worker")
          // Não definir workerSrc para usar modo sem worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = ""
        }
      } catch (workerError) {
        console.warn("Erro ao configurar worker:", workerError)
        // Usar modo sem worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = ""
      }
    }

    return pdfjsLib
  } catch (error) {
    console.error("Erro ao carregar PDF.js:", error)
    throw new Error("PDF.js não está disponível")
  }
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log("=== Iniciando extração de PDF ===")
    console.log("Arquivo:", file.name, "Tamanho:", file.size)

    // Validações básicas
    if (!file || file.type !== "application/pdf") {
      throw new Error("Arquivo deve ser um PDF válido")
    }

    if (file.size > 15 * 1024 * 1024) {
      // Reduzir ainda mais o limite para 15MB
      throw new Error("Arquivo PDF muito grande. Limite: 15MB")
    }

    if (file.size === 0) {
      throw new Error("Arquivo PDF está vazio")
    }

    // Carregar PDF.js
    let pdfjsLib
    try {
      pdfjsLib = await loadPDFJS()
      console.log("PDF.js carregado com sucesso")
    } catch (loadError) {
      console.error("Erro ao carregar PDF.js:", loadError)
      throw new Error("Processador de PDF não disponível. Use um arquivo de texto (.txt)")
    }

    // Converter arquivo para ArrayBuffer
    let arrayBuffer
    try {
      arrayBuffer = await file.arrayBuffer()
      console.log("Arquivo convertido para ArrayBuffer")
    } catch (bufferError) {
      console.error("Erro ao ler arquivo:", bufferError)
      throw new Error("Erro ao ler o arquivo PDF")
    }

    // Carregar documento PDF com configurações ultra-simples
    let pdf
    try {
      console.log("Carregando documento PDF...")

      // Configurações mínimas para evitar problemas de compatibilidade
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        // Configurações mínimas
        verbosity: 0,
        // Não especificar outras configurações que podem causar problemas
      })

      // Timeout mais generoso
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout ao carregar PDF (45s)")), 45000)
      })

      pdf = await Promise.race([loadingTask.promise, timeoutPromise])
      console.log(`PDF carregado: ${pdf.numPages} páginas`)
    } catch (pdfError) {
      console.error("Erro ao carregar PDF:", pdfError)

      // Tratar erros específicos
      if (pdfError.message.includes("API version") && pdfError.message.includes("Worker version")) {
        throw new Error("Incompatibilidade de versão do processador PDF. Tente converter o arquivo para texto (.txt)")
      }
      if (pdfError.message.includes("Invalid PDF")) {
        throw new Error("Arquivo PDF inválido ou corrompido")
      }
      if (pdfError.message.includes("Password")) {
        throw new Error("PDF protegido por senha não é suportado")
      }
      if (pdfError.message.includes("Timeout")) {
        throw new Error("PDF muito complexo. Tente um arquivo menor")
      }

      throw new Error("Erro ao processar PDF. Tente converter para texto (.txt)")
    }

    // Extrair texto das páginas
    let fullText = ""
    const maxPages = Math.min(pdf.numPages, 8) // Reduzir para 8 páginas

    console.log(`Processando ${maxPages} páginas...`)

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        console.log(`Processando página ${pageNum}`)

        const page = await pdf.getPage(pageNum)

        // Timeout por página mais generoso
        const pageTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Timeout na página")), 15000) // 15s por página
        })

        // Configurações mínimas para extração de texto
        const textContent = await Promise.race([
          page.getTextContent({
            // Configurações mínimas
            normalizeWhitespace: true,
          }),
          pageTimeoutPromise,
        ])

        // Extrair texto simples
        const pageText = textContent.items
          .filter((item: any) => item.str && typeof item.str === "string")
          .map((item: any) => item.str.trim())
          .filter((text: string) => text.length > 0)
          .join(" ")

        if (pageText.trim()) {
          fullText += `\n--- Página ${pageNum} ---\n${pageText}\n`
        }

        // Limpar página da memória
        try {
          page.cleanup()
        } catch (cleanupError) {
          console.warn("Erro ao limpar página:", cleanupError)
        }
      } catch (pageError) {
        console.warn(`Erro na página ${pageNum}:`, pageError)
        fullText += `\n--- Página ${pageNum} (erro) ---\n`
      }
    }

    // Limpar documento
    try {
      pdf.destroy()
    } catch (cleanupError) {
      console.warn("Erro ao limpar PDF:", cleanupError)
    }

    // Verificar se extraiu algum texto
    if (!fullText.trim()) {
      throw new Error("Não foi possível extrair texto. O PDF pode ser uma imagem escaneada ou estar protegido")
    }

    if (pdf.numPages > maxPages) {
      fullText += `\n--- Processadas apenas ${maxPages} de ${pdf.numPages} páginas ---\n`
    }

    console.log("=== Extração concluída com sucesso ===")
    return fullText.trim()
  } catch (error) {
    console.error("=== Erro na extração de PDF ===", error)

    // Retornar erro mais específico
    if (error.message.includes("API version") || error.message.includes("Worker version")) {
      throw new Error("Incompatibilidade de versão do PDF. Converta o arquivo para texto (.txt)")
    }

    if (error.message.includes("PDF.js não está disponível")) {
      throw new Error("Processador de PDF não disponível. Use arquivo de texto (.txt)")
    }

    if (error.message.includes("muito grande")) {
      throw new Error("Arquivo muito grande. Use arquivo menor que 15MB ou converta para texto")
    }

    if (error.message.includes("protegido") || error.message.includes("Password")) {
      throw new Error("PDF protegido por senha. Remova a proteção ou use arquivo de texto")
    }

    if (error.message.includes("corrompido") || error.message.includes("Invalid")) {
      throw new Error("Arquivo PDF corrompido. Tente outro arquivo ou use texto")
    }

    if (error.message.includes("imagem escaneada")) {
      throw new Error("PDF parece ser imagem escaneada. Use OCR ou converta para texto")
    }

    // Erro genérico mais amigável
    throw new Error("Erro ao processar PDF. Recomendamos converter para arquivo de texto (.txt)")
  }
}

// Função simplificada para validar PDF
export function validatePDFFile(file: File): boolean {
  try {
    if (!file) return false
    if (file.type !== "application/pdf") return false
    if (file.size === 0) return false
    if (file.size > 15 * 1024 * 1024) return false // 15MB
    return true
  } catch {
    return false
  }
}

// Função simplificada para info do PDF
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

    // Configurações mínimas
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      verbosity: 0,
    }).promise

    const info = {
      numPages: pdf.numPages,
      fileSize: file.size,
      fileName: file.name,
    }

    pdf.destroy()
    return info
  } catch (error) {
    console.warn("Erro ao obter info do PDF:", error)
    // Retornar info básica mesmo com erro
    return {
      numPages: 0,
      fileSize: file.size,
      fileName: file.name,
    }
  }
}

// Função para testar disponibilidade do PDF.js
export async function testPDFJS(): Promise<boolean> {
  try {
    const pdfjsLib = await loadPDFJS()

    // Testar se consegue criar um documento simples
    const testPDF = new Uint8Array([
      0x25,
      0x50,
      0x44,
      0x46,
      0x2d,
      0x31,
      0x2e,
      0x34, // %PDF-1.4
    ])

    try {
      const doc = await pdfjsLib.getDocument({ data: testPDF }).promise
      doc.destroy()
      return true
    } catch (testError) {
      console.warn("Teste de PDF falhou:", testError)
      return false
    }
  } catch (error) {
    console.warn("PDF.js não disponível:", error)
    return false
  }
}
