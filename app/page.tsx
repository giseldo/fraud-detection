"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Wifi,
  WifiOff,
  ArrowLeft,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { analyzeContract } from "./actions/analyze-contract"
import SampleContract from "./components/sample-contract"
import FileUpload from "./components/file-upload"
import LandingPage from "./components/landing-page"

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
  const [showLanding, setShowLanding] = useState(true)
  const [contractText, setContractText] = useState("")
  const [analysis, setAnalysis] = useState<FraudAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [pdfSupported, setPdfSupported] = useState<boolean | null>(null)

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

  const handleStartAnalysis = () => {
    setShowLanding(false)
  }

  const handleBackToLanding = () => {
    setShowLanding(true)
    // Limpar estado da análise
    setContractText("")
    setAnalysis(null)
    setError("")
    setUploadedFileName("")
  }

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

  const handleFileProcessed = (text: string, fileName: string) => {
    setContractText(text)
    setUploadedFileName(fileName)
    setError("")
    console.log(`Arquivo processado: ${fileName}, ${text.length} caracteres`)
  }

  const handleFileError = (errorMessage: string) => {
    setError(errorMessage)
    setUploadedFileName("")
  }

  // Mostrar landing page
  if (showLanding) {
    return <LandingPage onStartAnalysis={handleStartAnalysis} />
  }

  // Funções auxiliares (mantidas iguais)
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

  // Interface da ferramenta de análise
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da ferramenta */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleBackToLanding} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">FraudeDetector</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${getPDFStatusColor()}`}>
              {getPDFStatusIcon()}
              <span>{getPDFStatusText()}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Fraudes em Licitações</h1>
            <p className="text-gray-600">
              Faça upload do contrato e receba uma análise detalhada de possíveis irregularidades
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <SampleContract onLoadSample={setContractText} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Upload do Contrato
                  </CardTitle>
                  <CardDescription>Faça upload de um arquivo PDF ou TXT com o contrato de licitação</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileProcessed={handleFileProcessed}
                    onError={handleFileError}
                    pdfSupported={pdfSupported}
                    disabled={isAnalyzing}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Texto do Contrato</CardTitle>
                  <CardDescription>
                    {uploadedFileName
                      ? `Texto extraído de: ${uploadedFileName}`
                      : "Cole o texto do contrato ou faça upload de um arquivo acima"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contract-text">Conteúdo do Contrato</Label>
                    <Textarea
                      id="contract-text"
                      placeholder="Cole aqui o texto completo do contrato de licitação..."
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      className="min-h-[300px] mt-2"
                      disabled={isAnalyzing}
                    />
                    {contractText.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {contractText.length.toLocaleString()} caracteres
                      </div>
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
                    disabled={isAnalyzing || !contractText.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analisando Contrato...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Analisar Fraudes
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
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
                    <p>Faça upload de um contrato para ver a análise de fraude</p>
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
    </div>
  )
}
