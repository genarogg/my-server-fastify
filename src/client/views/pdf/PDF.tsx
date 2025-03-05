'use client'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Header from '@editorjs/header'

import {
    CodeIcon,
    Save,
    FolderOpen,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from 'lucide-react'

interface PDFProps { }

const PDF: React.FC<PDFProps> = () => {
    useEffect(() => {
        let editor: any;

        (async () => {
            // Importar dinámicamente EditorJS y Checklist para asegurar que se ejecuten solo en el cliente.
            const EditorJSModule = await import('@editorjs/editorjs');
            const EditorJS = EditorJSModule.default;

            //@ts-ignore
            const ChecklistModule = await import('@editorjs/checklist');
            const Checklist = ChecklistModule.default;
            //@ts-ignore
            const ParagraphModule = await import('@coolbytes/editorjs-paragraph');
            const Paragraph = ParagraphModule.default;

            //@ts-ignore
            const TableModule = await import('@medistream/editorjs-table');
            const Table = TableModule.default;

            //@ts-ignore
            const MarkerModule = await import('@editorjs/marker');
            const Marker = MarkerModule.default;

            //@ts-ignore
            const ColorPickerModule = await import('editorjs-color-picker');
            const ColorPicker = ColorPickerModule.default;

            //@ts-ignore
            const TexColorModule = await import('editorjs-text-color-plugin');
            console.log(TexColorModule); // Check if the module contains a default export or named exports
            const ColorPlugin = TexColorModule.default || TexColorModule;

            editor = new EditorJS({
                holder: 'editorjs',
                tools: {
                    header: {
                        class: Header as any,
                        inlineToolbar: true,
                    },
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    table: {
                        class: Table,
                        inlineToolbar: true,
                    },
                    ColorPicker: {
                        class: ColorPicker as any,
                        inlineToolbar: true,
                        config: {
                            colors: [
                                '#EC7878',
                                '#9C27B0',
                                '#FFFFFF',
                            ],
                            defaultColor: '#FF1300',
                        },
                    },
                    marker: {
                        class: Marker,
                        inlineToolbar: true,
                    },

                },
                data: {
                    blocks: [
                        {
                            type: 'header',
                            data: {
                                text: 'PDF Editor',
                                level: 1,
                            },
                        },
                        {
                            type: 'paragraph',
                            data: {
                                text: 'This is a simple PDF editor built with React and EditorJS.',
                            },
                        },
                    ],
                },
            });
        })();

        return () => {
            if (editor && typeof editor.destroy === 'function') {
                editor.destroy();
            }
        };
    }, []);

    const applyAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        // Implementar lógica de alineación aquí
    };

    const handleViewPdfMakeCode = async () => {
        // Implementar lógica para ver el código PDF aquí
    };

    const handleLoad = () => {
        // Implementar lógica para cargar aquí
    };

    const handleSave = async () => {
        // Implementar lógica para guardar aquí
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="/css/pdf/style.css" />
            </Helmet>
            <header>
                <div className="col-1">
                    <div className="alignment-buttons">
                        <button className="toolbar-button" title="Align Left" onClick={() => applyAlignment('left')}>
                            <AlignLeft size={16} />
                        </button>
                        <button className="toolbar-button" title="Align Center" onClick={() => applyAlignment('center')}>
                            <AlignCenter size={16} />
                        </button>
                        <button className="toolbar-button" title="Align Right" onClick={() => applyAlignment('right')}>
                            <AlignRight size={16} />
                        </button>
                        <button className="toolbar-button" title="Justify" onClick={() => applyAlignment('justify')}>
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
            </header>
            <main>
                <div className="editor-content">
                    <div id="editorjs" className="editor-js-container"></div>
                </div>
            </main>
        </>
    );
};

export default PDF;
