import React from "react";
import {$createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import {$setBlocksType} from "@lexical/selection";
import {$createHeadingNode, $isHeadingNode} from "@lexical/rich-text";
import {Button, Dropdown, Space, Tooltip} from "antd";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {BsTextParagraph} from "react-icons/bs";
import {LuHeading1, LuHeading2} from "react-icons/lu";
import {
    insertList,
    removeList
} from "@lexical/list";
import {OrderedListOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {ListPlugin} from "@lexical/react/LexicalListPlugin";
import {$isExtendedListNode, $getExtendedListNode} from "../Nodes/ExtendedListNode.jsx";

const SUPPORTED_BLOCK_TYPES = [
    {
        key: "paragraph",
        title: "Paragraph",
        icon: <BsTextParagraph/>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createParagraphNode()),
        typeFunction: $isParagraphNode
    },
    {
        key: "h1",
        title: "Large heading",
        icon: <LuHeading1/>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createHeadingNode("h1")),
        typeFunction: $isHeadingNode
    },
    {
        key: "h2",
        title: "Small heading",
        icon: <LuHeading2/>,
        createNodeFunction: ({selection}) => $setBlocksType(selection, () => $createHeadingNode("h2")),
    },
    {
        key: "bullet",
        title: "Bullet list",
        icon: <UnorderedListOutlined/>,
        createNodeFunction: ({editor, selectedBlockType}) => {
            const selection = $getSelection();
            const node = $getExtendedListNode(selection.getNodes()[0]);
            if (node) {
                if (node.getListType() !== "bullet") {
                    node.setListType("bullet");
                }
            } else {
                if (selectedBlockType.key === "bullet") {
                    removeList(editor);
                } else {
                    insertList(editor, "bullet")
                }
            }
        },
        appearOutside: true
    },
    {
        key: "number",
        title: "Numbered list",
        icon: <OrderedListOutlined/>,
        createNodeFunction: ({editor, selectedBlockType}) => {
            const selection = $getSelection();
            const node = $getExtendedListNode(selection.getNodes()[0]);
            if (node) {
                if (node.getListType() !== "number") {
                    node.setListType("number");
                }
            } else {
                if (selectedBlockType.key === "number") {
                    removeList(editor);
                } else {
                    insertList(editor, "number")
                }
            }
        },
        appearOutside: true,
    }
];

function getBlockType(node) {
    if (Array.isArray(node)) {
        return getBlockType(node[0]);
    }
    if (!node) {
        return "paragraph";
    }
    if ($isExtendedListNode(node)) {
        return node.getListType();
    }
    if ($isHeadingNode(node)) {
        return node.getTag()
    }
    return getBlockType(node.getParent())
}

export default function BlockPlugin() {
    const [editor] = useLexicalComposerContext();
    const [selectedBlockType, setSelectedBlockType] = React.useState(SUPPORTED_BLOCK_TYPES.filter(block => block.key === "paragraph")[0]);

    const blocks = SUPPORTED_BLOCK_TYPES.map((block, index) => {
        return {
            key: index,
            onClick: () => changeBlock(block),
            label: (<span>{block.icon} {block.title}</span>)
        }
    });

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const markedBlockType = getBlockType(selection.getNodes())
                setSelectedBlockType(SUPPORTED_BLOCK_TYPES.filter(block => block.key === markedBlockType)[0]);
            }
        });
    });

    function changeBlock(block) {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                block.createNodeFunction({selection, editor, selectedBlockType});
            }
        });
    }

    return (<Space>
        <ListPlugin/>
        {SUPPORTED_BLOCK_TYPES.filter(block => block.appearOutside).map((block, index) => {
            return (
                <Tooltip key={index} title={block.title} placement="bottom">
                    <Button icon={block.icon}
                            type="text"
                            disabled={!editor.isEditable()}
                            className={"toolbar-button " + (selectedBlockType.key === block.key ? "active" : "")}
                            onClick={() => changeBlock(block)}/>
                </Tooltip>
            );
        })}
        <Dropdown
            trigger={editor.isEditable() ? 'click' : ''}
            placement="bottom"
            menu={{
                items: blocks,
                style: {maxHeight: "200px", overflow: "auto"}
            }}>
            <Button className="toolbar-button"
                    type="text"
                    disabled={!editor.isEditable()}
                    style={{
                        width: "125px",
                        fontSize: "14px",
                        overflow: "hidden",
                        padding: "2px 4px"
                    }}><span>{selectedBlockType.icon} {selectedBlockType.title}</span></Button>
        </Dropdown>
    </Space>);
}