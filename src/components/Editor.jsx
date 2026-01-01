import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Delimiter from '@editorjs/delimiter';

const Editor = ({ data, onChange, placeholder }) => {
    const ref = useRef();
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: ref.current,
                tools: {
                    header: Header,
                    list: List,
                    table: Table,
                    quote: Quote,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                uploadByFile(file) {
                                    // Simulated upload
                                    return new Promise((resolve) => {
                                        setTimeout(() => {
                                            resolve({
                                                success: 1,
                                                file: {
                                                    url: URL.createObjectURL(file), // Local blob for demo
                                                }
                                            });
                                        }, 500);
                                    });
                                },
                                uploadByUrl(url) {
                                    return new Promise((resolve) => {
                                        resolve({
                                            success: 1,
                                            file: {
                                                url: url,
                                            }
                                        });
                                    });
                                }
                            }
                        }
                    },
                    embed: Embed,
                    marker: Marker,
                    inlineCode: InlineCode,
                    delimiter: Delimiter,
                },
                data: data || {},
                placeholder: placeholder || 'Start writing...',
                async onChange(api, event) {
                    const content = await api.saver.save();
                    onChange(content);
                },
            });
            editorRef.current = editor;
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return <div ref={ref} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', minHeight: '300px', background: 'white' }} />;
};

export default Editor;
