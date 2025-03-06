"use client"

import { Grid2x2 } from "lucide-react"

import type EditorJS from "@editorjs/editorjs"

interface InitializeEditorParams {
    editorRef: React.MutableRefObject<EditorJS | null>
    selectedPageSize: string
    updateEditorSize: (sizeKey: string) => void
    addBordersToBlocks: () => void
}

export const initializeEditor = async ({
    editorRef,
    selectedPageSize,
    updateEditorSize,
    addBordersToBlocks,
}: InitializeEditorParams) => {
    const EditorJSModule = await import("@editorjs/editorjs")
    const EditorJS = EditorJSModule.default

    // Importaciones dinámicas para las herramientas
    //@ts-ignore
    const HeaderModule = await import("editorjs-header-with-alignment")
    const Header = HeaderModule.default
    //@ts-ignore
    const ChecklistModule = await import("@editorjs/checklist")
    const Checklist = ChecklistModule.default
    //@ts-ignore
    const DelimiterModule = await import("@coolbytes/editorjs-delimiter")
    const Delimiter = DelimiterModule.default
    //@ts-ignore
    const ParagraphModule = await import("@coolbytes/editorjs-paragraph")
    const Paragraph = ParagraphModule.default
    //@ts-ignore
    const TableModule = await import("@medistream/editorjs-table")
    const Table = TableModule.default
    //@ts-ignore
    const MarkerModule = await import("@editorjs/marker")
    const Marker = MarkerModule.default
    //@ts-ignore
    const ColorPickerModule = await import("editorjs-color-picker")
    const ColorPicker = ColorPickerModule.default
    //@ts-ignore
    const ImageModule = await import("@editorjs/image")
    const Image = ImageModule.default
    //@ts-ignore
    const ListModule = await import("@editorjs/list")
    const List = ListModule.default
    //@ts-ignore
    const ColumnsModule = await import("@calumk/editorjs-columns")
    const Columns = ColumnsModule.default


    // Import Layout properly
    //@ts-ignore
    const EditorJSLayoutModule = await import("editorjs-layout")
    // Based on the example, we need to access it this way
    const EditorJSLayout = EditorJSLayoutModule.default || EditorJSLayoutModule


    const header = {
        class: Header as any,
        inlineToolbar: true,
        //cambiar icono
        toolbox: {
            icon: `
                <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M6 3V21M18 12H7M18 3V21M4 21H8M4 3H8M16 21H20M16 3H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            `,
            title: "Header",
        },

    }

    const paragraph = {
        class: Paragraph,
        inlineToolbar: true,
    }

    const checklist = {
        class: Checklist,
        inlineToolbar: true,
    }

    const delimiter = {
        class: Delimiter,
        inlineToolbar: true,
    }
    const table = {
        class: Table,
        inlineToolbar: true,
        //cambiar icono
        toolbox: {
            icon: `
                <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'>
                    <rect x='48' y='48' width='416' height='416' rx='48' ry='48' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/>
                    <line x1='128' y1='48' x2='128' y2='464' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
                    <line x1='48' y1='128' x2='464' y2='128' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
                </svg>
            `,
            title: "Table",
        },

    }

    const colorPicker = {
        class: ColorPicker as any,
        inlineToolbar: true,
        config: {
            colors: [
                "#EC7878",
                "#9C27B0",
                "#673AB7",
                "#3F51B5",
                "#0070FF",
                "#03A9F4",
                "#00BCD4",
                "#4CAF50",
                "#8BC34A",
                "#CDDC39",
                "#FFF",
            ],
            defaultColor: "#FF1300",
        },
    }

    const image = {
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
    }

    const marker = {
        class: Marker,
        inlineToolbar: true,
    }

    const list = {
        class: List as any,
        inlineToolbar: true,
    }

    if (!editorRef.current) {
        try {
            const editor = new EditorJS({
                holder: "editorjs",
                tools: {
                    header,
                    paragraph,
                    checklist,
                    delimiter,
                    table,
                    colorPicker,
                    marker,
                    image,
                    list,
                    // columns: {
                    //     class: Columns,
                    //     config: {
                    //         EditorJsLibrary: EditorJS,
                    //         tools: {
                    //             header,
                    //             paragraph,
                    //             image
                    //         },
                    //         defaultLayout: 4
                    //     },
                        
                    // },
                    // Standard single-container layout
                    layout: {
                        class: EditorJSLayout.LayoutBlockTool,
                        config: {
                            EditorJS,  // Pass EditorJS constructor
                            editorJSConfig,  // Pass configuration for nested editors
                            enableLayoutEditing: false,
                            enableLayoutSaving: true,
                            initialData: {
                                itemContent: {
                                    1: {
                                        blocks: [],
                                    },
                                },
                                layout: {
                                    type: "container",
                                    id: "",
                                    className: "",
                                    style: "border: 1px solid #e0e0e0; padding: 16px;",
                                    children: [
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px;",
                                            itemContentId: "1",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    // // Two-column layout
                    twoColumns: {
                        class: EditorJSLayout.LayoutBlockTool,
                        config: {
                            EditorJS,
                            editorJSConfig,
                            enableLayoutEditing: false,
                            enableLayoutSaving: false,
                            initialData: {
                                itemContent: {
                                    1: {
                                        blocks: [],
                                    },
                                    2: {
                                        blocks: [],
                                    },
                                },
                                layout: {
                                    type: "container",
                                    id: "",
                                    className: "",
                                    style: "border: 1px solid #e0e0e0; display: flex; justify-content: space-around; padding: 16px;",
                                    children: [
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px; width: 48%;",
                                            itemContentId: "1",
                                        },
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px; width: 48%;",
                                            itemContentId: "2",
                                        },
                                    ],
                                },
                            },
                        },
                        shortcut: "CMD+2",
                        toolbox: {
                            icon: `
                                <svg xmlns='http://www.w3.org/2000/svg' width="16" height="16" viewBox='0 0 512 512'>
                                    <rect x='128' y='128' width='336' height='336' rx='57' ry='57' fill='none' stroke='currentColor' stroke-linejoin='round' stroke-width='32'/>
                                    <path d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/>
                                </svg>
                            `,
                            title: "2 columns",
                        },
                    },
                    // // Three-column layout
                    threeColumns: {
                        class: EditorJSLayout.LayoutBlockTool,
                        config: {
                            EditorJS,
                            editorJSConfig,
                            enableLayoutEditing: false,
                            enableLayoutSaving: false,
                            initialData: {
                                itemContent: {
                                    1: {
                                        blocks: [],
                                    },
                                    2: {
                                        blocks: [],
                                    },
                                    3: {
                                        blocks: [],
                                    },
                                },
                                layout: {
                                    type: "container",
                                    id: "",
                                    className: "",
                                    style: "border: 1px solid #e0e0e0; display: flex; justify-content: space-around; padding: 16px;",
                                    children: [
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px; width: 15%;",
                                            itemContentId: "1",
                                        },
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px; width: 31%;",
                                            itemContentId: "2",
                                        },
                                        {
                                            type: "item",
                                            id: "",
                                            className: "",
                                            style: "border: 1px solid #e0e0e0; padding: 8px; width: 31%;",
                                            itemContentId: "3",
                                        },
                                    ],
                                },
                            },
                        },
                        shortcut: "CMD+3",
                        toolbox: {
                            icon: `
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="8" y1="3" x2="8" y2="21"></line>
                                    <line x1="16" y1="3" x2="16" y2="21"></line>
                                </svg>
                            `,
                            title: "3 columns",
                        },
                    },
                },

                onChange: () => {
                    addBordersToBlocks()
                },
            })

            editorRef.current = editor
        } catch (error) {
            console.error("Error initializing Editor.js:", error)
        }
    }

    updateEditorSize(selectedPageSize)
}