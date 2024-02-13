import "./Editor.css";
import React from "react";
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import ToolbarPlugin from "./Plugins/Toolbar/ToolbarPlugin.jsx";
import {$generateNodesFromDOM} from "@lexical/html";
import {$getRoot, ParagraphNode, TextNode} from "lexical";
import {ExtendedTextNode} from "./Nodes/ExtendedTextNode.jsx";
import {lexicalTheme} from "./LexicalTheme";
import {HeadingNode} from "@lexical/rich-text";
import {ListItemNode, ListNode} from "@lexical/list";
import {LinkNode} from "@lexical/link";
import {ImageNode} from "./Nodes/ImageNode.jsx";
import {ExtendedListItemNode} from "./Nodes/ExtendedListItemNode.jsx";
import {ExtendedListNode} from "./Nodes/ExtendedListNode.jsx";
import DivParagraphNode from "./Nodes/DivParagraphNode.jsx";
import {InsightNode} from "../InsightsNode.jsx";


export default function SpotnikEditor({initialDom, innerEditor, toolbarPlugins, footerPlugins, disabled}) {
    const initialConfig = {
        namespace: "reporting-editor",
        editable: !disabled,
        editorState: (editor) => {
            if (initialDom) {
                const nodes = $generateNodesFromDOM(editor, initialDom);
                $getRoot().append(...nodes);
            }
        },
        onError: (error) => {
            console.error(error);
        },
        theme: lexicalTheme,
        nodes: [
            DivParagraphNode,
            {replace: ParagraphNode, with: () => new DivParagraphNode()},
            ExtendedTextNode,
            {replace: TextNode, with: (node) => new ExtendedTextNode(node.__text)},
            HeadingNode,
            ExtendedListNode,
            {replace: ListNode, with: (node) => new ExtendedListNode(node.getListType(), node.getStart())},
            ExtendedListItemNode,
            {replace: ListItemNode, with: (node) => new ExtendedListItemNode(node.getValue(), node.getChecked())},
            LinkNode,
            ImageNode,
            InsightNode
        ]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div id="editor-container">
                {toolbarPlugins?.length > 0 && <ToolbarPlugin toolbarPlugins={toolbarPlugins}/>}
                <div id="inner-editor-container">
                    {innerEditor}
                </div>
            </div>
            <div id="footer-plugins-container">
                {footerPlugins?.map((plugin, index) => {
                        return (React.cloneElement(plugin, {key: index}))
                    })
                }
            </div>
        </LexicalComposer>
    );
}