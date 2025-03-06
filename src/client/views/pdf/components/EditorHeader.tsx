"use client"
import React from "react"
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, CodeIcon, Save, FolderOpen } from "lucide-react"

interface PageSize {
  name: string
  width: number
  height: number
}

interface EditorHeaderProps {
  selectedPageSize: string
  pageSizes: Record<string, PageSize>
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  applyAlignment: (alignment: "left" | "center" | "right" | "justify") => void
  handleViewPdfMakeCode: () => void
  handleSaveClick: () => void
  handleLoadClick: () => void
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  selectedPageSize,
  pageSizes,
  handlePageSizeChange,
  applyAlignment,
  handleViewPdfMakeCode,
  handleSaveClick,
  handleLoadClick,
}) => {
  return (
    <header>
      <div className="col-1">
        <div className="alignment-buttons">
          <button className="toolbar-button" title="Align Left" onClick={() => applyAlignment("left")}>
            <AlignLeft size={16} />
          </button>
          <button className="toolbar-button" title="Align Center" onClick={() => applyAlignment("center")}>
            <AlignCenter size={16} />
          </button>
          <button className="toolbar-button" title="Align Right" onClick={() => applyAlignment("right")}>
            <AlignRight size={16} />
          </button>
          <button className="toolbar-button" title="Justify" onClick={() => applyAlignment("justify")}>
            <AlignJustify size={16} />
          </button>
        </div>
        <div className="page-size-selector">
          <label htmlFor="page-size">Tamaño de Hoja:</label>
          <select
            id="page-size"
            value={selectedPageSize}
            onChange={handlePageSizeChange}
            className="page-size-select"
          >
            {Object.entries(pageSizes).map(([key, size]) => (
              <option key={key} value={key}>
                {size.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-2">
        <button className="action-button" onClick={handleViewPdfMakeCode}>
          <CodeIcon size={16} />
          <span className="action-button-text">View Code</span>
        </button>
        <button className="action-button" onClick={handleSaveClick}>
          <Save size={16} />
          <span className="action-button-text">Save</span>
        </button>
        <button className="action-button" onClick={handleLoadClick}>
          <FolderOpen size={16} />
          <span className="action-button-text">Load</span>
        </button>
      </div>
    </header>
  )
}

export default EditorHeader
