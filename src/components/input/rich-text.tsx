import { useCallback, useRef, useState } from 'react';
import RcTiptapEditor from 'reactjs-tiptap-editor';

import {
    BaseKit,
    Bold,
    BulletList,
    Clear,
    Code,
    CodeBlock,
    Color,
    ColumnActionButton,
    Emoji,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    History,
    HorizontalRule,
    Image,
    ImportWord,
    Indent,
    Italic,
    Katex,
    LineHeight,
    Link,
    MoreMark,
    OrderedList,
    SearchAndReplace,
    SlashCommand,
    Strike,
    Table,
    TaskList,
    TextAlign,
    Underline,
    TextDirection,
    Mention,
    Attachment,
} from 'reactjs-tiptap-editor/extension-bundle';

import 'katex/dist/katex.min.css';

import 'reactjs-tiptap-editor/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '@/lib/utils';

function convertBase64ToBlob(base64: string) {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}


const extensions = [
    BaseKit.configure({
        multiColumn: true,
        placeholder: {
            showOnlyCurrent: true,
        },
        // characterCount: {
        //     limit: 50_000,
        // },
    }),
    History,
    SearchAndReplace,
    TextDirection,
    Clear,
    FontFamily,
    Heading.configure({ spacer: true }),
    FontSize,
    Bold,
    Italic,
    Underline,
    Strike,
    MoreMark,
    Katex,
    Emoji,
    Color.configure({ spacer: true }),
    Highlight,
    BulletList,
    OrderedList,
    TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
    Indent,
    LineHeight,
    TaskList.configure({
        spacer: true,
        taskItem: {
            nested: true,
        },
    }),
    Link,
    Image.configure({
        upload: (files: File) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(URL.createObjectURL(files))
                }, 500)
            })
        },
    }),
    SlashCommand,
    HorizontalRule,
    Code.configure({
        toolbar: false,
    }),
    CodeBlock,
    ColumnActionButton,
    Table,
    ImportWord.configure({
        upload: (files: File[]) => {
            const f = files.map(file => ({
                src: URL.createObjectURL(file),
                alt: file.name,
            }))
            return Promise.resolve(f)
        },
    }),
    Mention,
    Attachment.configure({
        upload: (file: any) => {
            // fake upload return base 64
            const reader = new FileReader()
            reader.readAsDataURL(file)

            return new Promise((resolve) => {
                setTimeout(() => {
                    const blob = convertBase64ToBlob(reader.result as string)
                    resolve(URL.createObjectURL(blob))
                }, 300)
            })
        },
    }),
];

function debounce(func: any, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        // @ts-ignore
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function Editor({
    value,
    onChange,
    fieldState
}: Readonly<{
    value: string;
    onChange: (value: string) => void;
    fieldState: any;
}>) {
    const refEditor = useRef<any>(null);

    const [theme, setTheme] = useState('light');
    const [disable, setDisable] = useState(false);

    const onValueChange = useCallback(
        debounce((val: any) => {
            onChange(val);
        }, 300),
        [onChange],
    );

    return (
        <div className={cn(
            'border rounded-lg overflow-clip',
            fieldState.invalid && 'border-rose-500',
        )}>
            <RcTiptapEditor
                ref={refEditor}
                output='html'
                content={value}
                onChangeContent={onValueChange}
                extensions={extensions}
                disabled={disable}
                dark={theme === 'dark'}
            />
        </div>
    );
}

export default Editor;