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


    const editorJSConfig = {
        // Any configuration that should be passed to nested editors
    } // Define the editor.js config that will be passed to layout tool

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
                    columns: {
                        class: Columns,
                        config: {
                            EditorJsLibrary: EditorJS,
                            tools: {
                                header,
                                paragraph,
                                image
                            },
                            defaultLayout: 4
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