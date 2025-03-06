export const handleSave = async (editorInstance: any) => {
  if (editorInstance) {
    try {
      const savedData = await editorInstance.save()
      const json = JSON.stringify(savedData)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "documento.json"
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Error saving content. Please try again.")
    }
  }
}

export const handleLoad = (editorInstance: any) => {
  if (!editorInstance) {
    console.error("Editor instance not available")
    return
  }

  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".json"
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        try {
          const parsedContent = JSON.parse(content)
          await editorInstance.render(parsedContent)
        } catch (error) {
          console.error("Error al cargar el archivo:", error)
          alert("El archivo no es válido")
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

