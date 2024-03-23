import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$generateHtmlFromNodes} from "@lexical/html";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin.js";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin.js";
import {TabIndentationPlugin} from "@lexical/react/LexicalTabIndentationPlugin.js";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary.js";
import {ContentEditable} from "@lexical/react/LexicalContentEditable.js";

export default function ReportingPlugin({onChange}) {
    const [editor] = useLexicalComposerContext();

    function onChangeAdapter() {
        editor.update(() => {
            onChange($generateHtmlFromNodes(editor, null));
        });
    }

    return [<RichTextPlugin key="rich-text"
            contentEditable={<ContentEditable style={{
                height: "100%",
                overflow: "auto",
                padding: "0 5px",
                outline: 0
            }}/>}
            placeholder={<span className="editor-placeholder">Body</span>}
            ErrorBoundary={LexicalErrorBoundary}/>,
        <OnChangePlugin key="on-change-plugin" onChange={onChangeAdapter}/>,
        <TabIndentationPlugin key="tab-plugin"/>
    ]
}