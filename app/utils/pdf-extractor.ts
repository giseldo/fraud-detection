"use client"

import * as pdfjsLib from "pdfjs-dist"

// Configurar o worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Converter arquivo para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Carregar o documento PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ""

    // Extrair texto de cada página
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Combinar todos os itens de texto da página
      const pageText = textContent.items
        .map((item: any) => {
          if ("str" in item) {
            return item.str
          }
          return ""
        })
        .join(" ")

      fullText += `\n--- Página ${pageNum} ---\n${pageText}\n`
    }

    if (!fullText.trim()) {
      throw new Error("Não foi possível extrair texto do PDF. O arquivo pode estar protegido ou ser uma imagem.")
    }

    return fullText.trim()
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error)
    throw new Error(`Erro ao processar PDF: ${error.message}`)
  }
}

// Função auxiliar para validar se o arquivo é um PDF válido
export function validatePDFFile(file: File): boolean {
  return file.type === "application/pdf" && file.size > 0
}

// Função para obter informações do PDF
export async function getPDFInfo(file: File): Promise<{
  numPages: number
  title?: string
  author?: string
  subject?: string
}> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    const metadata = await pdf.getMetadata()

    return {
      numPages: pdf.numPages,
      title: metadata.info?.Title || undefined,
      author: metadata.info?.Author || undefined,
      subject: metadata.info?.Subject || undefined,
    }
  } catch (error) {
    console.error("Erro ao obter informações do PDF:", error)
    throw error
  }
}
