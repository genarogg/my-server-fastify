"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import type React from "react"
import EditorHeader from "./components/EditorHeader"
import { handleLoad, handleSave } from "./fn/fileOperations"
import { initializeEditor } from "./fn/editorInitializer"
import type EditorJS from "@editorjs/editorjs"
import PdfMakeModal from "./components/PdfMakeModal"

type PDFProps = {}

interface PageSize {
  name: string
  width: number
  height: number
}

const PDFEditor: React.FC<PDFProps> = () => {
  const [selectedPageSize, setSelectedPageSize] = useState<string>("letter")
  const editorRef = useRef<EditorJS | null>(null)
  const [showPdfMakeModal, setShowPdfMakeModal] = useState(false)
  const [pdfMakeCode, setPdfMakeCode] = useState("")

  const pageSizes: Record<string, PageSize> = {
    letter: { name: 'Letter (8.5" x 11")', width: 215.9, height: 279.4 },
    legal: { name: 'Legal (8.5" x 14")', width: 215.9, height: 355.6 },
    tabloid: { name: 'Tabloid (11" x 17")', width: 279.4, height: 431.8 },
    a4: { name: "A4 (210mm x 297mm)", width: 210, height: 297 },
    a3: { name: "A3 (297mm x 420mm)", width: 297, height: 420 },
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPageSize(e.target.value)
    updateEditorSize(e.target.value)
  }

  const updateEditorSize = useCallback(
    (sizeKey: string) => {
      const editorContainer = document.getElementById("editorjs")
      if (editorContainer) {
        Object.keys(pageSizes).forEach((size) => {
          editorContainer.classList.remove(`size-${size}`)
        })
        editorContainer.classList.add(`size-${sizeKey}`)
      }
    },
    [pageSizes],
  )

  const addBordersToBlocks = () => {
    const editorContainer = document.getElementById("editorjs")
    if (editorContainer) {
      editorContainer.classList.add("editor-with-borders")
    }
    const blocks = document.querySelectorAll(".ce-block")
    blocks.forEach((block) => {
      block.addEventListener("click", () => {
        document.querySelectorAll(".ce-block--selected").forEach((el) => {
          el.classList.remove("ce-block--selected")
        })
        block.classList.add("ce-block--selected")
      })
    })
  }

  useEffect(() => {
    initializeEditor({
      editorRef,
      selectedPageSize,
      updateEditorSize,
      addBordersToBlocks,
    })

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy()
      }
    }
  }, [selectedPageSize, updateEditorSize])

  const applyAlignment = (alignment: "left" | "center" | "right" | "justify") => {
    console.log(`Applying ${alignment} alignment`)
    // Lógica de alineación pendiente de implementar
  }

  const handleViewPdfMakeCode = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save()
        const pdfMakeCode = convertEditorJsToPdfMake(savedData)
        setPdfMakeCode(pdfMakeCode)
        setShowPdfMakeModal(true)
      } catch (error) {
        console.error("Error generando el código PDF:", error)
      }
    }
  }

  const handleLoadClick = () => {
    handleLoad(editorRef.current)
  }

  const handleSaveClick = () => {
    handleSave(editorRef.current)
  }

  const handleCopyModalCode = () => {
    navigator.clipboard
      .writeText(pdfMakeCode)
      .then(() => {
        alert("¡Código copiado al portapapeles!")
      })
      .catch((err) => {
        console.error("Error copiando el código: ", err)
      })
  }

  return (
    <>
      <EditorHeader
        selectedPageSize={selectedPageSize}
        pageSizes={pageSizes}
        handlePageSizeChange={handlePageSizeChange}
        applyAlignment={applyAlignment}
        handleViewPdfMakeCode={handleViewPdfMakeCode}
        handleSaveClick={handleSaveClick}
        handleLoadClick={handleLoadClick}
      />
      <main>
        <div className="editor-content">
          <div id="editorjs" className="editor-js-container"></div>
        </div>
      </main>
      {showPdfMakeModal && (
        <PdfMakeModal
          pdfMakeCode={pdfMakeCode}
          onClose={() => setShowPdfMakeModal(false)}
          onCopy={handleCopyModalCode}
        />
      )}
    </>
  )
}

export default PDFEditor
