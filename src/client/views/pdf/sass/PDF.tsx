'use client'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Header from '@editorjs/header'

import { handleLoad, handleSave } from "./fn/fileOperations"

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

// Define page size options
interface PageSize {
    name: string;
    width: number;
    height: number;
}

const PDF: React.FC<PDFProps> = () => {
    // State for selected page size
    const [selectedPageSize, setSelectedPageSize] = useState<string>('letter');

    // Page size options
    const pageSizes: Record<string, PageSize> = {
        letter: { name: 'Letter (8.5" x 11")', width: 215.9, height: 279.4 },
        legal: { name: 'Legal (8.5" x 14")', width: 215.9, height: 355.6 },
        tabloid: { name: 'Tabloid (11" x 17")', width: 279.4, height: 431.8 },
        a4: { name: 'A4 (210mm x 297mm)', width: 210, height: 297 },
        a3: { name: 'A3 (297mm x 420mm)', width: 297, height: 420 },
    };

    // Handle page size change
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPageSize(e.target.value);
        updateEditorSize(e.target.value);
    };

    // Update editor container size based on selected paper size
    const updateEditorSize = (sizeKey: string) => {
        const editorContainer = document.getElementById('editorjs');
        if (editorContainer) {
            const size = pageSizes[sizeKey];
            // Set a scaled version of the paper size to the editor
            const scale = 0.8; // Scale factor to fit in screen
            editorContainer.style.width = `${size.width * scale}mm`;
            editorContainer.style.minHeight = `${size.height * scale}mm`;
            editorContainer.style.margin = '0 auto'; // Center it
            editorContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
            editorContainer.style.backgroundColor = 'white';
            editorContainer.style.position = 'relative'; 
        }
    };

    useEffect(() => {
        let editor: any;

        (async () => {
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
            const ImageModule = await import('@editorjs/image');
            const Image = ImageModule.default;

            //@ts-ignore
            const ListModule = await import('@editorjs/list');
            const List = ListModule.default;

            //@ts-ignore
            const ColumnsModule = await import('@calumk/editorjs-columns');
            const Columns = ColumnsModule.default;


            const column_tools = {
                header: Header,
                paragraph: Paragraph,
            };

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
                            colors: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
                            defaultColor: '#FF1300',
                        },
                    },
                    marker: {
                        class: Marker,
                        inlineToolbar: true,
                    },
                    image: {
                        class: Image,
                        config: {
                            uploader: {
                                uploadByFile(file: File) {
                                    return new Promise((resolve) => {
                                        const reader = new FileReader()
                                        reader.onload = (event) => {
                                            resolve({
                                                success: 1,
                                                file: {
                                                    url: event.target?.result,
                                                },
                                            })
                                        }
                                        reader.readAsDataURL(file)
                                    })
                                },
                            },
                        },
                    },
                    list: {
                        class: List as any,
                        inlineToolbar: true,
                    },
                    columns: {
                        class: Columns,
                        config: {
                            EditorJsLibrary: EditorJS,
                            tools: column_tools,
                        },
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
                onChange: () => {
                    // Add borders to blocks when editor changes
                    addBordersToBlocks();
                }
            });
            
            // Initialize the editor with the default page size
            updateEditorSize(selectedPageSize);
            
            // Add a small delay to ensure the editor is fully loaded before adding our custom CSS
            setTimeout(() => {
                addToolbarStyles();
                addBordersToBlocks();
            }, 500);
        })();

        const addToolbarStyles = () => {
            // Create a style element
            const styleEl = document.createElement('style');
            styleEl.id = 'editorjs-toolbar-styles';
            
            // Define styles to constrain the toolbar within the editor area
            styleEl.innerHTML = `
                
            `;
            
            // Add to document
            document.head.appendChild(styleEl);
        };
        
        const addBordersToBlocks = () => {
            // Add a class to the editor container to enable more specific CSS targeting
            const editorContainer = document.getElementById('editorjs');
            if (editorContainer) {
                editorContainer.classList.add('editor-with-borders');
            }
            
            // Add selected class on click to blocks
            const blocks = document.querySelectorAll('.ce-block');
            blocks.forEach(block => {
                block.addEventListener('click', () => {
                    // Remove selected class from all blocks
                    document.querySelectorAll('.ce-block--selected').forEach(el => {
                        el.classList.remove('ce-block--selected');
                    });
                    
                    // Add to clicked block
                    block.classList.add('ce-block--selected');
                });
            });
        };

        // Set up a mutation observer to add borders to new blocks
        const setupMutationObserver = () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && 
                        (mutation.target.classList.contains('codex-editor__redactor') || 
                         document.querySelector('.codex-editor__redactor')?.contains(mutation.target as Node))) {
                        addBordersToBlocks();
                    }
                });
            });
            
            // Start observing after a delay to ensure editor is initialized
            setTimeout(() => {
                const container = document.querySelector('.codex-editor__redactor');
                if (container) {
                    observer.observe(container, { 
                        childList: true, 
                        subtree: true 
                    });
                }
            }, 1000);
            
            return observer;
        };
        
        const observer = setupMutationObserver();

        return () => {
            if (editor && typeof editor.destroy === 'function') {
                editor.destroy();
            }
            
            // Clean up custom styles
            const styleEl = document.getElementById('editorjs-toolbar-styles');
            if (styleEl) {
                styleEl.remove();
            }
            
            // Disconnect observer
            observer.disconnect();
        };
    }, []);

    const applyAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
        // Implementar lógica de alineación aquí
    };

    const handleViewPdfMakeCode = async () => {
        // Implementar lógica para ver el código PDF aquí
    };

    const handleLoadClick = () => {
        handleLoad(editorRef.current)
      }
    
      const handleSaveClick = () => {
        handleSave(editorRef.current)
      }

 


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
                    
                    {/* Page size selector */}
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
            <main>
                <div className="editor-content">
                    <div id="editorjs" className="editor-js-container"></div>
                </div>
            </main>
            
            {/* Add some CSS for the new page size selector and editor container */}
            <style jsx>{`
              
            `}</style>
        </>
    );
};

export default PDF;