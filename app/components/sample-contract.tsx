"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SampleContractProps {
  onLoadSample: (text: string) => void
}

export default function SampleContract({ onLoadSample }: SampleContractProps) {
  const sampleContract = `
EDITAL DE LICITAÇÃO Nº 001/2024
PREGÃO ELETRÔNICO

OBJETO: Aquisição de equipamentos de informática para modernização do parque tecnológico da Prefeitura Municipal.

1. ESPECIFICAÇÕES TÉCNICAS E PREÇOS:

Item 1 - Computador desktop com processador Intel Core i7 de 12ª geração, especificamente modelo 12700K
Memória RAM de 32GB DDR4 3200MHz marca Kingston modelo KVR32N22D8/16
SSD de 1TB marca Samsung modelo 980 PRO
Quantidade: 50 unidades
Valor unitário: R$ 4.500,00
Valor total: R$ 225.000,00

Item 2 - Monitor de 27 polegadas 4K marca LG modelo 27UP850-W
Quantidade: 50 unidades  
Valor unitário: R$ 1.200,00
Valor total: R$ 60.000,00

Item 3 - Teclado e mouse sem fio marca Logitech modelo MX Keys e MX Master 3
Quantidade: 50 conjuntos
Valor unitário: R$ 350,00
Valor total: R$ 17.500,00

2. CRITÉRIOS DE HABILITAÇÃO:
- Empresa deve ter sede na cidade há pelo menos 10 anos
- Faturamento mínimo de R$ 50 milhões nos últimos 3 anos
- Certificação ISO 9001 emitida especificamente pela empresa TÜV Rheinland
- Experiência comprovada em fornecimento para órgãos públicos federais nos últimos 5 anos
- Equipe técnica com pelo menos 20 profissionais certificados Microsoft e Cisco

3. PRAZO DE ENTREGA: 15 dias corridos após assinatura do contrato

4. VALOR TOTAL ESTIMADO: R$ 302.500,00

5. CRITÉRIO DE JULGAMENTO: Menor preço global

6. PRAZO PARA APRESENTAÇÃO DE PROPOSTAS: 3 dias úteis

7. GARANTIA: 12 meses para todos os equipamentos

8. CONDIÇÕES DE PAGAMENTO: À vista, em até 30 dias após entrega e aceite

Observações:
- Não serão aceitos equipamentos similares ou equivalentes
- Todas as especificações devem ser rigorosamente atendidas
- A empresa vencedora deverá manter estoque local de peças de reposição por 5 anos
  `

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Exemplo de Contrato</CardTitle>
        <CardDescription>Carregue um contrato de exemplo para testar a análise de fraude</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onLoadSample(sampleContract)} variant="outline" className="w-full">
          Carregar Contrato de Exemplo
        </Button>
      </CardContent>
    </Card>
  )
}
