"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Search,
  TrendingUp,
  FileText,
  Zap,
  Users,
  Award,
  ArrowRight,
  Upload,
  BarChart3,
  Eye,
  Clock,
} from "lucide-react"

interface LandingPageProps {
  onStartAnalysis: () => void
}

export default function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Detecção Inteligente",
      description: "IA avançada identifica padrões suspeitos e irregularidades em contratos de licitação",
      color: "text-blue-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Análise de Preços PNCP",
      description: "Comparação automática com preços médios do Portal Nacional de Contratações Públicas",
      color: "text-green-600",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Suporte PDF e TXT",
      description: "Processe documentos PDF ou arquivos de texto com extração automática de conteúdo",
      color: "text-purple-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Relatórios Detalhados",
      description: "Análises completas com score de risco, padrões suspeitos e recomendações específicas",
      color: "text-red-600",
    },
  ]

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Análise Rápida",
      description: "Resultados em segundos",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Transparência",
      description: "Identificação clara de irregularidades",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Score de Risco",
      description: "Classificação objetiva de 0-100%",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Economia de Tempo",
      description: "Automatiza análise manual",
    },
  ]

  const stats = [
    { number: "95%", label: "Precisão na detecção" },
    { number: "< 30s", label: "Tempo de análise" },
    { number: "15+", label: "Tipos de fraude detectados" },
    { number: "100%", label: "Gratuito e seguro" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FraudeDetector</span>
            </div>
            <Button onClick={onStartAnalysis} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              Analisar Contrato
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-4">🚀 Powered by IA + PNCP</Badge>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Detecte Fraudes em
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Licitações
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Ferramenta inteligente que utiliza IA para identificar irregularidades, padrões suspeitos e superfaturamento
            em contratos de licitação pública. Análise rápida, precisa e gratuita.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={onStartAnalysis}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            >
              <Upload className="w-5 h-5 mr-2" />
              Começar Análise Gratuita
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 bg-transparent">
              <FileText className="w-5 h-5 mr-2" />
              Ver Exemplo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como Funciona a Detecção</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa IA analisa múltiplos aspectos do contrato para identificar possíveis irregularidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por Que Usar o FraudeDetector?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Economize tempo e aumente a precisão na identificação de irregularidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-blue-600">{benefit.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Processo de Análise</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3 passos simples para uma análise completa de fraudes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Upload do Contrato</h3>
              <p className="text-gray-600">Faça upload do arquivo PDF ou cole o texto do contrato de licitação</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Análise Inteligente</h3>
              <p className="text-gray-600">IA analisa padrões suspeitos e compara preços com base de dados do PNCP</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Relatório Detalhado</h3>
              <p className="text-gray-600">Receba score de risco, padrões identificados e recomendações específicas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Fraud */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tipos de Fraude Detectados</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nossa IA identifica mais de 15 tipos diferentes de irregularidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Superfaturamento", desc: "Preços acima do mercado", icon: <TrendingUp className="w-5 h-5" /> },
              {
                title: "Especificações Restritivas",
                desc: "Critérios que favorecem fornecedor específico",
                icon: <FileText className="w-5 h-5" />,
              },
              {
                title: "Prazos Inadequados",
                desc: "Tempo insuficiente para competição",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                title: "Critérios Excessivos",
                desc: "Qualificações desnecessárias",
                icon: <Award className="w-5 h-5" />,
              },
              { title: "Linguagem Vaga", desc: "Termos ambíguos no contrato", icon: <Eye className="w-5 h-5" /> },
              {
                title: "Limitação de Competição",
                desc: "Cláusulas que reduzem concorrência",
                icon: <Users className="w-5 h-5" />,
              },
            ].map((fraud, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                      {fraud.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{fraud.title}</h3>
                      <p className="text-gray-600 text-sm">{fraud.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto para Detectar Fraudes?</h2>
          <p className="text-xl mb-8 opacity-90">Comece agora mesmo a análise gratuita do seu contrato de licitação</p>
          <Button
            size="lg"
            onClick={onStartAnalysis}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
          >
            <Upload className="w-5 h-5 mr-2" />
            Iniciar Análise Gratuita
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FraudeDetector</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Ferramenta gratuita para detecção de fraudes em licitações públicas
              </p>
              <p className="text-gray-500 text-xs mt-1">Powered by IA + PNCP • Desenvolvido com v0.dev</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
