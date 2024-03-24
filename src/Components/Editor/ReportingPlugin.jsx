import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin.js";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin.js";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import {ContentEditable} from "@lexical/react/LexicalContentEditable.js";
import {useEffect, useState} from "react";

export default function ReportingPlugin({onChange}) {
    const [editor] = useLexicalComposerContext();
    const [editorState, setEditorState] = useState();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (editorState) onChange(editorState)
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [editorState]);

    function onChangeAdapter() {
        editor.update(() => {
            setEditorState($generateHtmlFromNodes(editor, null));
        });
    }

    return [<RichTextPlugin key="rich-text"
                            contentEditable={<ContentEditable style={{
                                width: "100%",
                                flexGrow: 1,
                                outline: 0
                            }}/>}
                            ErrorBoundary={LexicalErrorBoundary}/>,
        <OnChangePlugin key="on-change-plugin" onChange={onChangeAdapter}/>,
        <TabIndentationPlugin key="tab-plugin"/>
    ]
}