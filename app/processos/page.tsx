import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ProcessosTable } from "@/components/processos-table"
import { PlusCircle } from "lucide-react"
import { getProcessos } from "@/lib/actions/processos"
import { NovoProcessoDialog } from "@/components/novo-processo-dialog"

export const metadata: Metadata = {
  title: "Processos - Sistema de Gerenciamento para Advogados",
  description: "Acompanhe seus processos judiciais.",
}

export default async function ProcessosPage() {
  const processos = await getProcessos()

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
          <h2 className="text-3xl font-bold tracking-tight">Processos</h2>
          <div className="flex items-center space-x-2">
            <NovoProcessoDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Processo
              </Button>
            </NovoProcessoDialog>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Processos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus processos judiciais. Visualize prazos, audiências e documentos relacionados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProcessosTable processos={processos} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
