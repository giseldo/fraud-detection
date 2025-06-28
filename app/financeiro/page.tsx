import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { FinanceiroTable } from "@/components/financeiro-table"
import { TrendingUp, TrendingDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Financeiro - Sistema de Gerenciamento para Advogados",
  description: "Gerencie suas finanças e honorários.",
}

export default function FinanceiroPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <TrendingDown className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Nova Receita
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 24.500</div>
              <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 8.200</div>
              <p className="text-xs text-muted-foreground">-5% desde o último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Honorários Pendentes</CardTitle>
              <div className="h-4 w-4 text-yellow-500">$</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.350</div>
              <p className="text-xs text-muted-foreground">5 clientes com pagamentos pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <div className="h-4 w-4 text-green-500">$</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 16.300</div>
              <p className="text-xs text-muted-foreground">+18% desde o último mês</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Transações Financeiras</CardTitle>
            <CardDescription>
              Visualize todas as suas transações financeiras, incluindo honorários, despesas e receitas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinanceiroTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
