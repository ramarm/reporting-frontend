import {$getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND} from "lexical";
import {useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button, Space, Tooltip} from "antd";
import {BoldOutlined, ItalicOutlined, StrikethroughOutlined, UnderlineOutlined} from "@ant-design/icons";

const SUPPORTED_TEXT_FORMATS = [
    {
        type: "bold",
        tooltip: "Bold",
        icon: <BoldOutlined/>
    },
    {
        type: "italic",
        tooltip: "Italic",
        icon: <ItalicOutlined/>
    },
    {
        type: "underline",
        tooltip: "Underline",
        icon: <UnderlineOutlined/>
    },
    {
        type: "strikethrough",
        tooltip: "Strikethrough",
        icon: <StrikethroughOutlined/>
    }
];

export default function StylePlugin() {
    const [editor] = useLexicalComposerContext()
    const [selectedFormats, setSelectedFormats] = useState([]);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setSelectedFormats(SUPPORTED_TEXT_FORMATS.map((format) => {
                        if (selection.hasFormat(format.type)) {
                            return format.type;
                        }
                        return false;
                    }).filter((format) => format)
                );
            }
        });
    });

    function handleSelect(formatType) {
        setSelectedFormats((prev) => {
            if (prev.includes(formatType)) {
                return prev.filter((format) => format !== formatType);
            } else {
                return [...prev, formatType];
            }
        });
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType)
    }

    function isFormatActive(formatType) {
        return selectedFormats.includes(formatType);
    }

    return (
        <Space>
            {SUPPORTED_TEXT_FORMATS.map((format) => (
                <Tooltip title={format.tooltip} placement="bottom" key={format.type}>
                    <Button icon={format.icon}
                            type="text"
                            disabled={!editor.isEditable()}
                            className={"toolbar-button " + (isFormatActive(format.type) ? "active" : "")}
                            onClick={() => handleSelect(format.type)}/>
                </Tooltip>
            ))}
        </Space>
    );
}
