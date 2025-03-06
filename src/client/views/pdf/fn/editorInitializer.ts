"use client"

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

    //@ts-ignore
    const LayoutModule = await import("editorjs-layout")
    const Layout = LayoutModule.default

    const column_tools = {
        header: Header,
        paragraph: Paragraph,

    }



    if (!editorRef.current) {
        const editor = new EditorJS({
            holder: "editorjs",
            tools: {
                header: {
                    class: Header as any,
                    inlineToolbar: true,

                },
             
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                delimiter: {
                    class: Delimiter,
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
            onChange: () => {
                addBordersToBlocks()
            },
        })

        editorRef.current = editor
    }

    updateEditorSize(selectedPageSize)
}
