import React from "react";
import {AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined} from "@ant-design/icons";
import {Button, Space, Tooltip} from "antd";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isParagraphNode, $isRangeSelection, FORMAT_ELEMENT_COMMAND} from "lexical";
import KeyboardEventPlugin from "./KeyboardPlugin";
import {$isExtendedListNode} from "../Nodes/ExtendedListNode.jsx";
import {$isHeadingNode} from "@lexical/rich-text";

const ALIGN_OPTIONS = [
    {
        title: "Left",
        align: "left",
        icon: <AlignLeftOutlined/>
    },
    {
        title: "Center",
        align: "center",
        icon: <AlignCenterOutlined/>
    },
    {
        title: "Right",
        align: "right",
        icon: <AlignRightOutlined/>
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

    return (
        <Space>
            <KeyboardEventPlugin/>
            {ALIGN_OPTIONS.map((align) => (
                <Tooltip key={align.align}
                         title={align.title}
                         placement="bottom">
                    <Button className={"toolbar-button" + (selectedAlign === align.align ? " active" : "")}
                            type="text"
                            disabled={!editor.isEditable()}
                            onClick={() => handleAlign(align)}
                            icon={align.icon}/>
                </Tooltip>
            ))}
        </Space>
    )
}