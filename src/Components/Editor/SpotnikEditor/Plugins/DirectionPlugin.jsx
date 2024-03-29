import React from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import KeyboardEventPlugin, {getClosestElementNode} from "./KeyboardPlugin";
import {$isExtendedListNode} from "../Nodes/ExtendedListNode.jsx";
import {$isHeadingNode} from "@lexical/rich-text";
import {Button} from "monday-ui-react-core";

const DIRECTION_OPTIONS = [
    {
        title: "LTR",
        direction: "ltr",
        icon: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="20" height="20"
                   xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M9 10v5h2V4h2v11h2V4h2V2H9C6.79 2 5 3.79 5 6s1.79 4 4 4zm12 8-4-4v3H5v2h12v3l4-4z"></path>
        </svg>
    },
    {
        title: "RTL",
        direction: "rtl",
        icon: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20" width="20"
                   xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M10 10v5h2V4h2v11h2V4h2V2h-8C7.79 2 6 3.79 6 6s1.79 4 4 4zm-2 7v-3l-4 4 4 4v-3h12v-2H8z"></path>
        </svg>
    }
]

function getSelectedDirection(node) {
    if (Array.isArray(node)) {
        return getSelectedDirection(node[0])
    }
    if (!node) {
        return "ltr";
    }
    if ($isParagraphNode(node) || $isHeadingNode(node) || $isExtendedListNode(node)) {
        return node.getDirection() || "ltr";
    }
    return getSelectedDirection(node.getParent())
}

export default function DirectionPlugin() {
    const [editor] = useLexicalComposerContext()
    const [selectedDirection, setSelectedDirection] = React.useState("ltr");

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                setSelectedDirection(getSelectedDirection(selection.getNodes()));
            }
        });
    });

    function handleDirection(dir) {
        editor.update(() => {
            const selection = $getSelection();
            selection.getNodes().forEach((node) => {
                const elementNode = getClosestElementNode(node);
                elementNode.setDirection(dir.direction);
            })
        });
    }

    return [
        <KeyboardEventPlugin key="direction-keyboard-event"/>,
        ...DIRECTION_OPTIONS.map((direction) => <Button key={direction.direction}
                                                        size={Button.sizes.SMALL}
                                                        kind={Button.kinds.TERTIARY}
                                                        active={selectedDirection === direction.direction}
                                                        disabled={!editor.isEditable()}
                                                        onClick={() => handleDirection(direction)}>
            {direction.icon}
        </Button>)
    ]
}