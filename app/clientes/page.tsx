import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { ClientesTable } from "@/components/clientes-table"
import { PlusCircle } from "lucide-react"
import { getClientes } from "@/lib/actions/clientes"
import { NovoClienteDialog } from "@/components/novo-cliente-dialog"

export const metadata: Metadata = {
  title: "Clientes - Sistema de Gerenciamento para Advogados",
  description: "Gerencie seus clientes de forma eficiente.",
}

export default async function ClientesPage() {
  const clientes = await getClientes()

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
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <div className="flex items-center space-x-2">
            <NovoClienteDialog>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </NovoClienteDialog>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Clientes</CardTitle>
            <CardDescription>
              Gerencie todos os seus clientes em um só lugar. Adicione, edite ou remova clientes conforme necessário.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientesTable clientes={clientes} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
