"use client"
import { useState } from "react"
import { Copy } from "lucide-react"

interface PdfMakeModalProps {
    pdfMakeCode: string
    onClose: () => void
    onCopy: () => void
}

const PdfMakeModal: React.FC<PdfMakeModalProps> = ({ pdfMakeCode, onClose, onCopy }) => {
    const [activeTab, setActiveTab] = useState("code")

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Código PDFMake</h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === "code" ? "active" : ""}`}
                        onClick={() => setActiveTab("code")}
                    >
                        Code
                    </button>
                    <button
                        className={`modal-tab ${activeTab === "instructions" ? "active" : ""}`}
                        onClick={() => setActiveTab("instructions")}
                    >
                        Instructions
                    </button>
                </div>
                <div className="modal-content">
                    {activeTab === "code" ? (
                        <pre className="code-viewer">{pdfMakeCode}</pre>
                    ) : (
                        <div>
                            <h3>Cómo usar este código:</h3>
                            <ol>
                                <li>Copiar el código generado</li>
                                <li>
                                    Ir a{" "}
                                    <a
                                        href="http://pdfmake.org/playground.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        PDFMake Playground
                                    </a>
                                </li>
                                <li>Pegar el código y ver el PDF</li>
                                <li>Personalizar estilos y distribución según se requiera</li>
                            </ol>
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button className="modal-button modal-button-primary" onClick={onCopy}>
                        <Copy size={16} />
                        Copy Code
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PdfMakeModal
