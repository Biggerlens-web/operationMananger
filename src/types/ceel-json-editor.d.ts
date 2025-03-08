declare module 'ceel-json-editor' {
    import {DefineComponent} from 'vue'

    interface JsonEditorProps {
        modelValue?: any
        mode?: string
        height?: string | number
        width?: string | number
        [key: string]: any
    }

    const JsonEditor: DefineComponent<JsonEditorProps>
    export default JsonEditor
}

// 添加 jsoneditor 的类型声明
declare module 'jsoneditor' {
    interface JsonEditorOptions {
        mode?: 'tree' | 'view' | 'form' | 'code' | 'text'
        modes?: Array<'tree' | 'view' | 'form' | 'code' | 'text'>
        name?: string
        schema?: any
        schemaRefs?: object
        search?: boolean
        history?: boolean
        navigationBar?: boolean
        statusBar?: boolean
        mainMenuBar?: boolean
        onError?: (error: Error) => void
        onModeChange?: (newMode: string, oldMode: string) => void
        onChange?: (v: string) => void
        onChangeJSON?: (json: any) => void
        onChangeText?: (jsonString: string) => void
        [key: string]: any
    }

    class JSONEditor {
        constructor(container: HTMLElement, options?: JsonEditorOptions, json?: any)
        set(json: any): void
        get(): any
        setText(text: string): void
        getText(): string
        destroy(): void
        getMode(): string
        setMode(mode: string): void
        setSchema(schema: any, schemaRefs?: object): void
    }

    export default JSONEditor
}
