"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError("Por favor, insira o texto do contrato para análise.")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalysis(null)

    const result = await analyzeContract(contractText)

    if (result.success) {
      setAnalysis(result.analysis)
    } else {
      setError(result.error || "Erro desconhecido")
    }

    setIsAnalyzing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setContractText(text)
      }
      reader.readAsText(file)
    } else {
      setError("Por favor, selecione um arquivo de texto (.txt)")
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detector de Fraudes em Licitações</h1>
          <p className="text-gray-600">
            Analise contratos de licitação para identificar possíveis irregularidades e fraudes
          </p>
          <p className="text-sm text-blue-600 mt-1">✨ Agora com análise de preços médios do PNCP</p>
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
                <CardDescription>Cole o texto do contrato ou faça upload de um arquivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                    Upload de Arquivo (opcional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <input id="file-upload" type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Selecionar Arquivo
                    </Button>
                    <span className="text-sm text-gray-500">Apenas arquivos .txt</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contract-text">Texto do Contrato</Label>
                  <Textarea
                    id="contract-text"
                    placeholder="Cole aqui o texto completo do contrato de licitação..."
                    value={contractText}
                    onChange={(e) => setContractText(e.target.value)}
                    className="min-h-[300px] mt-2"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleAnalyze} disabled={isAnalyzing || !contractText.trim()} className="w-full">
                  {isAnalyzing ? "Analisando..." : "Analisar Contrato"}
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
                  <p>Insira um contrato para ver a análise de fraude</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                        Análise de Preços (PNCP)
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
                                      <div className="font-medium">{formatCurrency(price.contractPrice)}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Preço Médio PNCP:</span>
                                      <div className="font-medium">
                                        {price.marketPrice ? formatCurrency(price.marketPrice) : "N/A"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge className={getRiskColor(price.riskLevel)} variant="outline">
                                      {price.riskLevel}
                                    </Badge>
                                    {price.marketPrice && (
                                      <span
                                        className={`text-sm font-medium ${
                                          price.priceVariation > 0 ? "text-red-600" : "text-green-600"
                                        }`}
                                      >
                                        {price.priceVariation > 0 ? "+" : ""}
                                        {price.priceVariation.toFixed(1)}%
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-sm text-gray-600 mt-2">{price.analysis}</p>
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
