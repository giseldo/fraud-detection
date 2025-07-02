"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, FileText, Loader2, CheckCircle, AlertTriangle, X, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void
  onError: (error: string) => void
  pdfSupported: boolean | null
  disabled?: boolean
}

interface FileInfo {
  name: string
  size: number
  type: string
  numPages?: number
}

export default function FileUpload({ onFileProcessed, onError, pdfSupported, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null)
  const [processingStep, setProcessingStep] = useState("")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    if (!file) return "Nenhum arquivo selecionado"

    if (file.type === "application/pdf") {
      if (pdfSupported === false) {
        return "Suporte a PDF não está disponível. Use arquivo de texto (.txt)"
      }
      if (pdfSupported === null) {
        return "Ainda verificando suporte a PDF. Aguarde um momento"
      }
      if (file.size > 15 * 1024 * 1024) {
        return "Arquivo PDF muito grande. Limite: 15MB"
      }
    } else if (file.type === "text/plain") {
      if (file.size > 5 * 1024 * 1024) {
        return "Arquivo de texto muito grande. Limite: 5MB"
      }
    } else {
      return "Tipo de arquivo não suportado. Use PDF (.pdf) ou texto (.txt)"
    }

    if (file.size === 0) {
      return "Arquivo está vazio"
    }

    return null
  }

  const processFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError(validationError)
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setCurrentFile({
      name: file.name,
      size: file.size,
      type: file.type,
    })

    try {
      if (file.type === "application/pdf") {
        await processPDF(file)
      } else if (file.type === "text/plain") {
        await processTextFile(file)
      }
    } catch (error) {
      console.error("Erro ao processar arquivo:", error)
      onError(error.message || "Erro ao processar arquivo")
      setCurrentFile(null)
    } finally {
      setIsProcessing(false)
      setProgress(0)
      setProcessingStep("")
    }
  }

  const processPDF = async (file: File) => {
    try {
      setProcessingStep("Carregando processador de PDF...")
      setProgress(10)

      const pdfUtils = await import("../utils/pdf-extractor")
      setProgress(20)

      setProcessingStep("Validando arquivo PDF...")
      if (!pdfUtils.validatePDFFile(file)) {
        throw new Error("Arquivo PDF inválido")
      }
      setProgress(30)

      setProcessingStep("Obtendo informações do PDF...")
      try {
        const info = await pdfUtils.getPDFInfo(file)
        setCurrentFile((prev) => (prev ? { ...prev, numPages: info.numPages } : null))
      } catch (infoError) {
        console.warn("Não foi possível obter informações do PDF:", infoError)
      }
      setProgress(50)

      setProcessingStep("Extraindo texto do PDF...")
      const extractedText = await pdfUtils.extractTextFromPDF(file)
      setProgress(90)

      if (!extractedText.trim()) {
        throw new Error("Nenhum texto foi extraído do PDF")
      }

      setProcessingStep("Finalizando...")
      setProgress(100)

      // Aguardar um pouco para mostrar o progresso completo
      await new Promise((resolve) => setTimeout(resolve, 500))

      onFileProcessed(extractedText, file.name)
    } catch (error) {
      throw new Error(`Erro ao processar PDF: ${error.message}`)
    }
  }

  const processTextFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      setProcessingStep("Lendo arquivo de texto...")
      setProgress(30)

      const reader = new FileReader()

      reader.onload = (e) => {
        const text = e.target?.result as string
        setProgress(80)

        if (text && text.trim()) {
          setProcessingStep("Finalizando...")
          setProgress(100)

          setTimeout(() => {
            onFileProcessed(text, file.name)
            resolve()
          }, 300)
        } else {
          reject(new Error("Arquivo de texto está vazio"))
        }
      }

      reader.onerror = () => {
        reject(new Error("Erro ao ler arquivo de texto"))
      }

      reader.readAsText(file)
    })
  }

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isProcessing) {
        setIsDragOver(true)
      }
    },
    [disabled, isProcessing],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled || isProcessing) return

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        processFile(files[0])
      }
    },
    [disabled, isProcessing],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && !disabled && !isProcessing) {
      processFile(file)
    }
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    e.target.value = ""
  }

  const clearFile = () => {
    setCurrentFile(null)
    setIsProcessing(false)
    setProgress(0)
    setProcessingStep("")
  }

  const getAcceptedTypes = () => {
    if (pdfSupported === true) return ".pdf,.txt"
    return ".txt"
  }

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return <File className="w-8 h-8 text-red-500" />
    }
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  const getStatusColor = () => {
    if (isProcessing) return "border-blue-300 bg-blue-50"
    if (isDragOver) return "border-green-300 bg-green-50"
    if (currentFile && !isProcessing) return "border-green-300 bg-green-50"
    return "border-gray-300 bg-gray-50"
  }

  return (
    <div className="space-y-4">
      {/* Área de Upload Visual */}
      <Card
        className={`transition-all duration-200 ${getStatusColor()} ${
          isDragOver ? "scale-105" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Processando arquivo...</h3>
                  <p className="text-sm text-gray-600">{processingStep}</p>
                  <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-gray-500">{progress}%</p>
                </div>
              </>
            ) : currentFile ? (
              <>
                <div className="flex items-center justify-center">{getFileIcon(currentFile.type)}</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Arquivo carregado</h3>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">{currentFile.name}</p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(currentFile.size)}</span>
                      {currentFile.numPages && (
                        <>
                          <span>•</span>
                          <span>{currentFile.numPages} páginas</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Processado
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={clearFile}>
                      <X className="w-3 h-3 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isDragOver ? "Solte o arquivo aqui" : "Faça upload do contrato"}
                  </h3>
                  <p className="text-sm text-gray-600">Arraste e solte um arquivo ou clique para selecionar</p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    {pdfSupported === true ? (
                      <>
                        <Badge variant="outline">PDF (máx. 15MB)</Badge>
                        <Badge variant="outline">TXT (máx. 5MB)</Badge>
                      </>
                    ) : pdfSupported === false ? (
                      <Badge variant="outline">Apenas TXT (máx. 5MB)</Badge>
                    ) : (
                      <Badge variant="outline">Verificando suporte...</Badge>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept={getAcceptedTypes()}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload-input"
                  disabled={disabled || isProcessing}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-upload-input")?.click()}
                  disabled={disabled || isProcessing || pdfSupported === null}
                  className="mt-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Suporte */}
      {pdfSupported === false && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Suporte a PDF indisponível:</strong> Use arquivos de texto (.txt) ou converta seu PDF online.
            <div className="mt-2 flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://www.ilovepdf.com/pt/pdf_para_txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Converter PDF para TXT
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Dicas de Uso */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">💡</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900">Dicas para melhor análise:</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Use PDFs com texto selecionável (não imagens escaneadas)</li>
                <li>• Inclua especificações técnicas, preços e critérios de habilitação</li>
                <li>• Arquivos menores processam mais rapidamente</li>
                <li>• Se houver problemas com PDF, converta para texto (.txt)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
