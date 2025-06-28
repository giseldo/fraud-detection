"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/clientes"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/clientes" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Clientes
      </Link>
      <Link
        href="/processos"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/processos" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Processos
      </Link>
      <Link
        href="/agenda"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/agenda" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Agenda
      </Link>
      <Link
        href="/documentos"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/documentos" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Documentos
      </Link>
      <Link
        href="/financeiro"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/financeiro" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Financeiro
      </Link>
    </nav>
  )
}
