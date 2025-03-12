<template>
    <div ref="editorContainer" class="json-editor-container"></div>
    <el-date-picker ref="datePicker" v-model="dateTime" class="datePicker" :class="{ showDatePicker: dateTime }"
        @change="handleDateChange" :style="{ left: mouseX, top: mouseY }" type="datetime"
        placeholder="Select date and time" />
</template>

<script setup lang="ts">
    import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
    import JSONEditor from 'jsoneditor'
    import 'jsoneditor/dist/jsoneditor.css'
    import dayjs from 'dayjs'
    //检测是否为日期时间格式
    const isValidDateTime = (dateStr: string): boolean => {
        const date = dayjs(dateStr, 'YYYY-MM-DD HH:mm:ss')
        const date2 = dayjs(dateStr, 'YYYY-MM-DD')
        const date3 = dayjs(dateStr, 'HH:mm:ss')
        return date.isValid() && (date.format('YYYY-MM-DD HH:mm:ss') === dateStr || date2.format('YYYY-MM-DD') === dateStr || date3.format('HH:mm:ss') === dateStr)
    }
    const props = withDefaults(defineProps<{
        modelValue?: object | any[]
        commentData?: Record<string, string>
        options?: any
        commentStyle?: Record<string, string>
    }>(), {
        modelValue: () => ({}),
        commentData: () => ({}),
        commentStyle: () => ({
            color: '#999',
            'margin-left': '8px',
            'font-size': '0.8em'
        })
    })

    const emit = defineEmits(['update:modelValue', 'inputChecked', 'dateChange'])



    //编辑时间日期
    const datePicker = ref<HTMLElement>()
    const dateTime = ref<string>('')
    const mouseX = ref<string>('')
    const mouseY = ref<string>('')
    const datePath = ref<string>('')
    const handleDateChange = (value: string) => {
        console.log('日期', value);
        emit('dateChange', {
            value: dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
            path: datePath.value
        })
    }

    const editorContainer = ref<HTMLElement>()


    let editor: any = null





    // 获取注释值的函数
    const getCommentValue = (key: string) => {
        // 直接匹配
        if (props.commentData[key]) {
            return props.commentData[key]
        }

        // 处理嵌套key
        const nestedKeys = Object.keys(props.commentData).filter(k => k.includes(','))
        const matchedKey = <any>nestedKeys.find(k => k.endsWith(`,${key}`))

        return matchedKey ? props.commentData[matchedKey] : undefined
    }

    const expendList = ref<string[]>([])
    const initParamsDesc = async () => {
        await nextTick()

        if (editor) {
            const mode = editor.getMode()
            console.log('mode', mode);
            if (mode === 'tree') {
                const treeElement = document.querySelector('.jsoneditor-tree')
                if (
                    treeElement
                ) {
                    console.log('treeElement', treeElement);
                    const tbody = treeElement.querySelector('tbody')
                    const tr = tbody?.childNodes
                    if (tr?.length) {
                        const trArray = Array.from(tr)

                        // trArray.splice(0, 1)
                        // trArray.splice(-1, 1)
                        console.log('trArray', trArray);
                        for (let item of trArray) {
                            const tds = item.childNodes

                            if (tds.length) {
                                console.log('tdslist', tds);
                                console.log('tds', tds[2]);
                                const contentTr = (tds[2] as Element).querySelector('tr')
                                const jsonPath = <string>contentTr?.querySelector('.jsoneditor-field')?.textContent
                                console.log('jsonPath', jsonPath);
                                const comment = <string>getCommentValue(jsonPath)

                                const contentTd = contentTr?.querySelectorAll('td')
                                const valueTd = contentTr?.querySelector('.jsoneditor-value')


                                //修复value模板
                                if (valueTd && valueTd instanceof HTMLElement) {
                                    // console.log('value', valueTd.innerHTML);

                                    const isdate = isValidDateTime(valueTd.innerHTML)
                                    // console.log('是否是日期', isdate);
                                    if (isdate) {
                                        const date = valueTd.innerHTML
                                        console.log('日期', valueTd.innerHTML);
                                        valueTd.addEventListener('click', (e) => {
                                            // console.log('修改时间', e);
                                            const target = e.target

                                            if (target instanceof HTMLElement) {
                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                const elementX = rect.left;
                                                const elementY = rect.top;
                                                mouseX.value = `${elementX}px`
                                                mouseY.value = `${elementY}px`
                                                dateTime.value = date
                                                datePicker.value?.focus()
                                                datePath.value = jsonPath
                                            }
                                        })

                                    } else if (
                                        valueTd.innerHTML === 'true' ||
                                        valueTd.innerHTML === 'false'
                                    ) {
                                        console.log('布尔值---------', valueTd.innerHTML);
                                        const inputEl = contentTr?.querySelectorAll('.jsoneditor-tree')[2]
                                        valueTd.style.display = 'none'
                                        if (inputEl) {
                                            const input = inputEl.querySelector('input')
                                            if (input) {
                                                let hasInitValue

                                                if (contentTd?.length) {
                                                    for (const item of contentTd) {
                                                        if (item.className === 'jsoneditor-initvalue') {
                                                            hasInitValue = true
                                                            break
                                                        } else {
                                                            hasInitValue = false
                                                        }
                                                    }
                                                }
                                                if (!hasInitValue) {

                                                    input.style.display = 'none'
                                                    const initvalueTd = document.createElement('td')
                                                    let value = valueTd.innerHTML === 'true' ? true : false
                                                    initvalueTd.className = 'jsoneditor-initvalue'
                                                    initvalueTd.innerHTML = `<label class="switch">
                                                                                <input type="checkbox"  :checked="switchValue">
                                                                                <span class="slider"></span>
                                                                            </label>`
                                                    const checkbox = initvalueTd.querySelector('input[type="checkbox"]');
                                                    if (checkbox instanceof HTMLInputElement) {
                                                        checkbox.checked = value;
                                                        checkbox.addEventListener('change', (e) => {

                                                            if (e.target instanceof HTMLInputElement) {
                                                                console.log('switchValue', e.target.checked);
                                                                // switchValue.value = e.target.checked;

                                                                emit('inputChecked', jsonPath)
                                                            }
                                                        });
                                                    }
                                                    contentTr?.appendChild(initvalueTd)


                                                }

                                            }
                                        }
                                    }
                                }



                                //修复key模板
                                let haveDesc
                                if (contentTd?.length) {
                                    for (let item of contentTd) {
                                        if (item.className === 'jsoneditor-desc') {
                                            haveDesc = true
                                            item.textContent = comment
                                            break
                                        } else {
                                            haveDesc = false
                                        }
                                    }
                                }
                                const newTd = document.createElement('td')
                                newTd.className = 'jsoneditor-desc'
                                newTd.textContent = comment
                                if (contentTr?.childNodes[1] && !haveDesc) {
                                    contentTr.childNodes[1].after(newTd)
                                }
                            }



                        }
                    }



                }
            }
        }
    }
    // 初始化编辑器
    const initEditor = () => {
        if (!editorContainer.value) {
            return
        }
        const defaultOptions: any = {
            mode: 'tree',
            onChange: () => {
                try {

                    initParamsDesc()
                } catch (e) {
                    console.error('JSON解析错误', e)
                }
            },
            onExpand: (path: any) => {
                console.log('打开的路径', path);
                expendList.value = path.path
                console.log('记录打开的路径', expendList.value);
                initParamsDesc()
            }
        }

        editor = new JSONEditor(
            editorContainer.value,
            Object.assign(defaultOptions, props.options),
            props.modelValue
        )
        initParamsDesc()
    }

    // 监听数据变化
    watch(() => props.modelValue, (newVal) => {
        console.log('newVal', newVal);
        if (editor) {
            console.log('editor', editor);
            editor.set(newVal)
            const options = {
                path: expendList.value,
                isExpand: true,
                recursive: false
            }
            editor.expand(options)
            initParamsDesc()

        }
    }, {
        deep: true
    })

    // 监听注释数据变化
    watch(() => props.commentData, () => {

    })

    onMounted(() => {
        initEditor()
    })

    onBeforeUnmount(() => {
        editor?.destroy()
    })
</script>

<style>
    .json-editor-container {
        height: 500px;
        width: 100%;
    }

    /* 自定义键样式 */
    .json-editor-key {
        font-weight: bold;
        color: #2c3e50;
    }

    .jsoneditor-desc {
        border: 1px solid transparent;
        min-height: 22px;
        min-width: 32px;
        line-height: 22px;
        padding: 2px;
        margin: 1px;
        display: flex !important;
        align-items: center !important;
        color: #f2632e !important;
    }

    .jsoneditor-initvalue {
        /* width: 100px; */

        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            /* 从 60px 减小到 40px */
            height: 22px;
            /* 从 34px 减小到 22px */
        }

        /* 隐藏默认的checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* 滑块的基本样式 */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 22px;
            /* 调整圆角以匹配新高度 */
        }

        /* 滑块的圆形按钮 */
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            /* 从 26px 减小到 16px */
            width: 16px;
            /* 从 26px 减小到 16px */
            left: 3px;
            /* 从 4px 减小到 3px */
            bottom: 3px;
            /* 从 4px 减小到 3px */
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        /* 选中状态的背景色 */
        input:checked+.slider {
            background-color: #2196F3;
        }

        /* 选中状态的滑块位置 */
        input:checked+.slider:before {
            transform: translateX(18px);
            /* 从 26px 减小到 18px，对应新的滑动距离 */
        }


    }

    .datePicker {
        position: fixed;
        z-index: -1;
        opacity: 0;
    }

    .showDatePicker {
        z-index: 10;
        /* opacity: 1; */
    }
</style>