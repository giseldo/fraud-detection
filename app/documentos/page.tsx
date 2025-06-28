import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import { DocumentosTable } from "@/components/documentos-table"
import { PlusCircle, FolderPlus } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentos - Sistema de Gerenciamento para Advogados",
  description: "Gerencie seus documentos jurídicos.",
}

export default function DocumentosPage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              Nova Pasta
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Documentos</CardTitle>
            <CardDescription>
              Organize e gerencie todos os seus documentos jurídicos. Crie modelos, armazene petições e mantenha tudo
              organizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentosTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
