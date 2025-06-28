import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { Calendar } from "@/components/ui/calendar"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Agenda - Sistema de Gerenciamento para Advogados",
  description: "Gerencie sua agenda de compromissos.",
}

export default function AgendaPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Agenda</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Compromisso
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
              <CardDescription>Visualize e gerencie seus compromissos.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="range" className="rounded-md border" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Próximos Compromissos</CardTitle>
              <CardDescription>Compromissos agendados para os próximos dias.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Audiência - Processo nº 12345</p>
                    <p className="text-sm text-muted-foreground">Hoje, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Reunião com cliente - Maria Silva</p>
                    <p className="text-sm text-muted-foreground">Amanhã, 10:00</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Prazo - Recurso Processo nº 54321</p>
                    <p className="text-sm text-muted-foreground">12/05/2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Despacho - Juiz da 2ª Vara</p>
                    <p className="text-sm text-muted-foreground">15/05/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
