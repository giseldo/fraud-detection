"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentCases() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Maria Silva vs Empresa XYZ</p>
          <p className="text-sm text-muted-foreground">Processo nº 12345-67.2023.8.26.0100</p>
        </div>
        <div className="ml-auto">
          <Badge>Em andamento</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">João Santos - Inventário</p>
          <p className="text-sm text-muted-foreground">Processo nº 98765-43.2023.8.26.0100</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline">Aguardando</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>PL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Pedro Lima - Divórcio</p>
          <p className="text-sm text-muted-foreground">Processo nº 54321-89.2023.8.26.0100</p>
        </div>
        <div className="ml-auto">
          <Badge className="bg-green-500">Concluído</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ana Costa - Trabalhista</p>
          <p className="text-sm text-muted-foreground">Processo nº 13579-24.2023.8.26.0100</p>
        </div>
        <div className="ml-auto">
          <Badge variant="destructive">Urgente</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>RF</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Roberto Ferreira - Contrato</p>
          <p className="text-sm text-muted-foreground">Processo nº 24680-13.2023.8.26.0100</p>
        </div>
        <div className="ml-auto">
          <Badge>Em andamento</Badge>
        </div>
      </div>
    </div>
  )
}
