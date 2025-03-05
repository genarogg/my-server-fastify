'use client'
import React from 'react'
import { Helmet } from 'react-helmet'

import {
    CodeIcon,
    Save,
    FolderOpen,
    ChevronDown,
    ListOrdered,
    QuoteIcon,
    Heading1,
    Heading2,
    Copy,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from "lucide-react"

interface PDFProps {

}

const PDF: React.FC<PDFProps> = () => {



    const applyAlignment = (alignment: "left" | "center" | "right" | "justify") => {

    }

    const handleViewPdfMakeCode = async () => {

    }

    const handleLoad = () => {

    }

    const handleSave = async () => {

    }

    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="/css/pdf/style.css" />
            </Helmet>
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
                </div>
                <div className="col-2">
                    <button className="action-button" onClick={handleViewPdfMakeCode}>
                        <CodeIcon size={16} />
                        <span className="action-button-text">View Code</span>
                    </button>
                    <button className="action-button" onClick={handleSave}>
                        <Save size={16} />
                        <span className="action-button-text">Save</span>
                    </button>
                    <button className="action-button" onClick={handleLoad}>
                        <FolderOpen size={16} />
                        <span className="action-button-text">Load</span>
                    </button>
                </div>
            </header >
            <main>
                <div className="editor-content">
                    <div className="editor-content">
                        <div id="editorjs" className="editor-js-container"></div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default PDF;