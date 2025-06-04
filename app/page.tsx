"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  File,
  Loader2,
  Wifi,
  WifiOff,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { analyzeContract } from "./actions/analyze-contract"
import SampleContract from "./components/sample-contract"

interface SuspiciousPattern {
  pattern: string
  description: string
  textSnippet: string
  severity: "BAIXA" | "MÉDIA" | "ALTA" | "CRÍTICA"
  recommendation: string
}

interface PriceAnalysis {
  item: string
  contractPrice: number
  marketPrice: number | null
  priceVariation: number
  riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO"
  analysis: string
}

interface FraudAnalysis {
  riskScore: number
  riskLevel: "BAIXO" | "MÉDIO" | "ALTO" | "CRÍTICO"
  suspiciousPatterns: SuspiciousPattern[]
  priceAnalysis: PriceAnalysis[]
  summary: string
  recommendations: string[]
}

export default function FraudDetectionApp() {
  const [contractText, setContractText] = useState("")
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExtractingPDF, setIsExtractingPDF] = useState(false)
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [error, setError] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [pdfInfo, setPdfInfo] = useState<{ numPages: number; fileSize: number } | null>(null)
  const [pdfSupported, setPdfSupported] = useState<boolean | null>(null) // null = testando

  // Testar suporte a PDF na inicialização
  useEffect(() => {
    const testPDF = async () => {
      try {
        console.log("Testando suporte a PDF...")
        const { testPDFJS } = await import("./utils/pdf-extractor")
        const supported = await testPDFJS()
        setPdfSupported(supported)
        console.log("Suporte a PDF:", supported ? "Disponível" : "Indisponível")
      } catch (error) {
        console.warn("Erro ao testar PDF.js:", error)
        setPdfSupported(false)
      }
    }

    testPDF()
  }, [])

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError("Por favor, insira o texto do contrato para análise.")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalysis(null)

    try {
      const result = await analyzeContract(contractText)

      if (result.success) {
        setAnalysis(result.analysis)
      } else {
        setError(result.error || "Erro desconhecido na análise")
      }
    } catch (analyzeError) {
      console.error("Erro na análise:", analyzeError)
      setError("Erro interno na análise. Tente novamente.")
    }

    setIsAnalyzing(false)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("=== Iniciando upload ===")
    console.log("Arquivo:", file.name, "Tipo:", file.type, "Tamanho:", file.size)

    setError("")
    setUploadedFileName(file.name)
    setPdfInfo(null)
    setExtractionProgress(0)

    try {
      if (file.type === "application/pdf") {
        // Verificar se PDF é suportado
        if (pdfSupported === false) {
          throw new Error("Suporte a PDF não está disponível. Use um arquivo de texto (.txt)")
        }

        if (pdfSupported === null) {
          throw new Error("Ainda verificando suporte a PDF. Aguarde um momento e tente novamente")
        }

        setIsExtractingPDF(true)
        setExtractionProgress(5)

        // Import dinâmico com tratamento de erro
        let pdfUtils
        try {
          pdfUtils = await import("./utils/pdf-extractor")
          setExtractionProgress(15)
        } catch (importError) {
          console.error("Erro ao importar PDF utils:", importError)
          throw new Error("Erro ao carregar processador de PDF")
        }

        // Validar arquivo
        setExtractionProgress(25)
        if (!pdfUtils.validatePDFFile(file)) {
          throw new Error("Arquivo PDF inválido ou muito grande (máximo 20MB)")
        }

        // Obter informações do PDF (opcional)
        setExtractionProgress(35)
        try {
          const info = await pdfUtils.getPDFInfo(file)
          setPdfInfo(info)
          console.log("Info do PDF:", info)
        } catch (infoError) {
          console.warn("Não foi possível obter informações do PDF:", infoError)
          // Continuar mesmo sem as informações
        }

        // Extrair texto
        setExtractionProgress(50)
        console.log("Iniciando extração de texto...")

        const extractedText = await pdfUtils.extractTextFromPDF(file)

        setExtractionProgress(90)
        console.log("Texto extraído com sucesso, tamanho:", extractedText.length)

        if (!extractedText.trim()) {
          throw new Error("Nenhum texto foi extraído do PDF")
        }

        setContractText(extractedText)
        setExtractionProgress(100)

        // Limpar progresso após um tempo
        setTimeout(() => {
          setIsExtractingPDF(false)
          setExtractionProgress(0)
        }, 1000)
      } else if (file.type === "text/plain") {
        console.log("Processando arquivo de texto...")

        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          if (text && text.trim()) {
            setContractText(text)
            console.log("Arquivo de texto carregado, tamanho:", text.length)
          } else {
            setError("Arquivo de texto está vazio")
          }
        }
        reader.onerror = () => {
          setError("Erro ao ler arquivo de texto")
        }
        reader.readAsText(file)
      } else {
        throw new Error("Tipo de arquivo não suportado. Use PDF (.pdf) ou texto (.txt)")
      }
    } catch (error) {
      console.error("=== Erro no upload ===", error)

      // Limpar estado em caso de erro
      setIsExtractingPDF(false)
      setUploadedFileName("")
      setPdfInfo(null)
      setExtractionProgress(0)

      // Mostrar erro específico com sugestões
      let errorMessage = error.message || "Erro desconhecido no upload"

      if (errorMessage.includes("versão") || errorMessage.includes("version")) {
        errorMessage += "\n\n💡 Sugestão: Converta o PDF para texto (.txt) usando um conversor online"
      }

      if (errorMessage.includes("muito grande")) {
        errorMessage += "\n\n💡 Sugestão: Reduza o tamanho do arquivo ou use apenas as páginas principais"
      }

      setError(errorMessage)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "BAIXO":
        return "bg-green-100 text-green-800 border-green-200"
      case "MÉDIO":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ALTO":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "CRÍTICO":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "BAIXA":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "MÉDIA":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "ALTA":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "CRÍTICA":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriceIcon = (variation: number) => {
    if (variation > 10) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (variation < -10) return <TrendingDown className="w-4 h-4 text-blue-500" />
    return <Minus className="w-4 h-4 text-green-500" />
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getPDFStatusIcon = () => {
    if (pdfSupported === null) return <Loader2 className="w-3 h-3 animate-spin" />
    if (pdfSupported === true) return <Wifi className="w-3 h-3" />
    return <WifiOff className="w-3 h-3" />
  }

  const getPDFStatusText = () => {
    if (pdfSupported === null) return "Verificando..."
    if (pdfSupported === true) return "PDF suportado"
    return "Apenas TXT"
  }

  const getPDFStatusColor = () => {
    if (pdfSupported === null) return "text-blue-600"
    if (pdfSupported === true) return "text-green-600"
    return "text-orange-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detector de Fraudes em Licitações</h1>
          <p className="text-gray-600">
            Analise contratos de licitação para identificar possíveis irregularidades e fraudes
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-sm text-blue-600">✨ Análise de preços médios do PNCP</span>
            <div className={`flex items-center gap-1 text-sm ${getPDFStatusColor()}`}>
              {getPDFStatusIcon()}
              <span>{getPDFStatusText()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <SampleContract onLoadSample={setContractText} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documento do Contrato
                </CardTitle>
                <CardDescription>
                  Cole o texto do contrato ou faça upload de um arquivo {pdfSupported === true ? "PDF/TXT" : "TXT"}
                  {pdfSupported === true && (
                    <div className="text-xs text-gray-500 mt-1">
                      💡 Se houver problemas com PDF, converta para TXT usando um conversor online
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pdfSupported === false && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Suporte a PDF não está disponível. Use arquivos de texto (.txt) ou cole o texto diretamente.
                      <br />
                      <span className="text-xs text-gray-500">
                        Isso pode acontecer devido a limitações de rede ou configuração do navegador.
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                    Upload de Arquivo
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        id="file-upload"
                        type="file"
                        accept={pdfSupported === true ? ".pdf,.txt" : ".txt"}
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isExtractingPDF || pdfSupported === null}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className="flex items-center gap-2"
                        disabled={isExtractingPDF || pdfSupported === null}
                      >
                        {isExtractingPDF ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {isExtractingPDF ? "Processando..." : "Selecionar Arquivo"}
                      </Button>
                      <span className="text-sm text-gray-500">
                        {pdfSupported === true
                          ? "PDF ou TXT (máx. 15MB)"
                          : pdfSupported === false
                            ? "Apenas TXT"
                            : "Verificando..."}
                      </span>
                    </div>

                    {uploadedFileName && !isExtractingPDF && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <File className="w-4 h-4" />
                        <span>
                          {uploadedFileName}
                          {pdfInfo &&
                            pdfInfo.numPages > 0 &&
                            ` (${pdfInfo.numPages} páginas, ${formatFileSize(pdfInfo.fileSize)})`}
                        </span>
                      </div>
                    )}

                    {isExtractingPDF && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Extraindo texto do PDF...</span>
                        </div>
                        <Progress value={extractionProgress} className="w-full" />
                        <div className="text-xs text-gray-500">
                          {extractionProgress < 25 && "Carregando processador..."}
                          {extractionProgress >= 25 && extractionProgress < 50 && "Validando arquivo..."}
                          {extractionProgress >= 50 && extractionProgress < 90 && "Extraindo texto..."}
                          {extractionProgress >= 90 && "Finalizando..."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="contract-text">Texto do Contrato</Label>
                  <Textarea
                    id="contract-text"
                    placeholder="Cole aqui o texto completo do contrato de licitação ou faça upload de um arquivo..."
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    className="min-h-[300px] mt-2"
                    disabled={isExtractingPDF}
                  />
                  {contractText.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">{contractText.length} caracteres</div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || isExtractingPDF || !contractText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    "Analisar Contrato"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section - mantém o mesmo código anterior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Resultado da Análise
              </CardTitle>
              <CardDescription>Indicadores de fraude e irregularidades encontradas</CardDescription>
            </CardHeader>
            <CardContent>
              {!analysis && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Insira um contrato para ver a análise de fraude</p>
                  <p className="text-sm mt-2">
                    Suporte a arquivos{" "}
                    {pdfSupported === true ? "PDF e TXT" : pdfSupported === false ? "TXT" : "verificando..."}
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                  <p className="text-gray-600">Analisando contrato...</p>
                  <p className="text-sm text-gray-500 mt-2">Consultando preços médios do PNCP...</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{analysis.riskScore}%</div>
                    <Badge className={getRiskColor(analysis.riskLevel)}>Risco {analysis.riskLevel}</Badge>
                  </div>

                  {/* Summary */}
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{analysis.summary}</AlertDescription>
                  </Alert>

                  {/* Price Analysis */}
                  {analysis.priceAnalysis && analysis.priceAnalysis.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Análise de Preços vs PNCP ({analysis.priceAnalysis.length} itens)
                      </h3>
                      <div className="space-y-3">
                        {analysis.priceAnalysis.map((price, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-400">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                {getPriceIcon(price.priceVariation)}
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{price.item}</h4>

                                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                    <div>
                                      <span className="text-gray-600">Preço Contrato:</span>
                                      <div className="font-medium text-lg">{formatCurrency(price.contractPrice)}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Preço Médio PNCP:</span>
                                      <div className="font-medium text-lg">
                                        {price.marketPrice ? formatCurrency(price.marketPrice) : "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex items-center gap-2">
                                    <Badge className={getRiskColor(price.riskLevel)} variant="outline">
                                      {price.riskLevel}
                                    </Badge>
                                    {price.marketPrice && (
                                      <span
                                        className={`text-sm font-bold ${
                                          price.priceVariation > 0 ? "text-red-600" : "text-green-600"
                                        }`}
                                      >
                                        {price.priceVariation > 0 ? "+" : ""}
                                        {price.priceVariation.toFixed(1)}%
                                      </span>
                                    )}
                                  </div>

                                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                    <strong>Análise:</strong> {price.analysis}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suspicious Patterns */}
                  {analysis.suspiciousPatterns.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Padrões Suspeitos Identificados</h3>
                      <div className="space-y-3">
                        {analysis.suspiciousPatterns.map((pattern, index) => (
                          <Card key={index} className="border-l-4 border-l-orange-400">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                {getSeverityIcon(pattern.severity)}
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{pattern.pattern}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>

                                  <div className="mt-3 p-3 bg-gray-50 rounded border-l-2 border-l-gray-300">
                                    <p className="text-sm font-mono text-gray-700">"{pattern.textSnippet}"</p>
                                  </div>

                                  <div className="mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      Severidade: {pattern.severity}
                                    </Badge>
                                  </div>

                                  <p className="text-sm text-blue-600 mt-2">
                                    <strong>Recomendação:</strong> {pattern.recommendation}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Recomendações Gerais</h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
