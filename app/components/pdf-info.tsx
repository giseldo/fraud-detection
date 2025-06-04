"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, User, Calendar, Hash } from "lucide-react"

interface PDFInfoProps {
  fileName: string
  numPages?: number
  title?: string
  author?: string
  fileSize?: number
}

export default function PDFInfo({ fileName, numPages, title, author, fileSize }: PDFInfoProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="border-l-4 border-l-green-400">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-sm text-green-800">PDF Carregado com Sucesso</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3" />
                <span className="font-medium">{fileName}</span>
              </div>

              {numPages && (
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  <span>{numPages} páginas</span>
                </div>
              )}

              {fileSize && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatFileSize(fileSize)}</span>
                </div>
              )}

              {title && (
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  <span>Título: {title}</span>
                </div>
              )}

              {author && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>Autor: {author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
