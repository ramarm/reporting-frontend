import React from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isParagraphNode, $isRangeSelection, FORMAT_ELEMENT_COMMAND} from "lexical";
import KeyboardEventPlugin from "./KeyboardPlugin";
import {$isExtendedListNode} from "../Nodes/ExtendedListNode.jsx";
import {$isHeadingNode} from "@lexical/rich-text";
import {Button} from "monday-ui-react-core";

const ALIGN_OPTIONS = [
    {
        title: "Left",
        align: "left",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <rect x="2.25" y="3" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.25" y="11" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.25" y="7" width="15.449" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.25" y="15" width="15.449" height="2" rx="1" fill="currentColor"></rect>
        </svg>
    },
    {
        title: "Center",
        align: "center",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <rect x="4.894" y="3" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="4.894" y="11" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.275" y="7" width="15.449" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.275" y="15" width="15.449" height="2" rx="1" fill="currentColor"></rect>
        </svg>
    },
    {
        title: "Right",
        align: "right",
        icon: <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
            <rect x="7.534" y="3" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="7.534" y="11" width="10.212" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.297" y="7" width="15.449" height="2" rx="1" fill="currentColor"></rect>
            <rect x="2.297" y="15" width="15.449" height="2" rx="1" fill="currentColor"></rect>
        </svg>
    }
]

function getDefaultAlign(node) {
    if (node && node.getDirection() === "rtl") {
        return "right"
    }
    return "left"
}

function getSelectedAlign(node) {
    if (Array.isArray(node)) {
        return getSelectedAlign(node[0])
    }
    if (!node) {
        return getDefaultAlign(node);
    }
    if ($isParagraphNode(node) || $isHeadingNode(node) || $isExtendedListNode(node)) {
        return node.getFormatType() || getDefaultAlign(node);
    }
    return getSelectedAlign(node.getParent())
}

export default function AlignPlugin() {
    const [editor] = useLexicalComposerContext()
    const [selectedAlign, setSelectedAlign] = React.useState("left");

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                setSelectedAlign(getSelectedAlign(selection.getNodes()));
            }
        });
    });

    function handleAlign(align) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align.align);
    }

    return [
        <KeyboardEventPlugin key="align-keyboard-event"/>,
        ...ALIGN_OPTIONS.map(align => (<Button key={align.align}
                                               kind={Button.kinds.TERTIARY}
                                               size={Button.sizes.SMALL}
                                               disabled={!editor.isEditable()}
                                               active={selectedAlign === align.align}
                                               onClick={() => handleAlign(align)}>
            {align.icon}
        </Button>))
    ]
}