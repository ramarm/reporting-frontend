import React from "react";
import {Button, Space, Tooltip} from "antd";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import KeyboardEventPlugin, {getClosestElementNode} from "./KeyboardPlugin";
import {$isExtendedListNode} from "../Nodes/ExtendedListNode.jsx";
import {$isHeadingNode} from "@lexical/rich-text";
import {MdFormatTextdirectionLToR, MdFormatTextdirectionRToL} from "react-icons/md";

const DIRECTION_OPTIONS = [
    {
        title: "LTR",
        direction: "ltr",
        icon: <MdFormatTextdirectionLToR/>
    },
    {
        title: "RTL",
        direction: "rtl",
        icon: <MdFormatTextdirectionRToL/>
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

    return (
        <Space>
            <KeyboardEventPlugin/>
            {DIRECTION_OPTIONS.map((direction) => (
                <Tooltip key={direction.direction}
                         title={direction.title}
                         placement="bottom">
                    <Button className={"toolbar-button" + (selectedDirection === direction.direction ? " active" : "")}
                            type="text"
                            disabled={!editor.isEditable()}
                            onClick={() => handleDirection(direction)}
                            icon={direction.icon}/>
                </Tooltip>
            ))}
        </Space>
    )
}