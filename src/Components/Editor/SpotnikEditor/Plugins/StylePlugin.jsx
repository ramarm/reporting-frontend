import {$getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND} from "lexical";
import {useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {IconButton} from "monday-ui-react-core";
import {Bold, Italic, Underline, StrikethroughS} from "monday-ui-react-core/icons";

const SUPPORTED_TEXT_FORMATS = [
    {
        type: "bold",
        tooltip: "Bold",
        icon: Bold
    },
    {
        type: "italic",
        tooltip: "Italic",
        icon: Italic
    },
    {
        type: "underline",
        tooltip: "Underline",
        icon: Underline
    },
    {
        type: "strikethrough",
        tooltip: "Strikethrough",
        icon: StrikethroughS
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

    return SUPPORTED_TEXT_FORMATS.map((format) => {
            return <IconButton key={format.type}
                               size={IconButton.sizes.SMALL}
                               icon={format.icon}
                               disabled={!editor.isEditable()}
                               active={isFormatActive(format.type)}
                               onClick={() => handleSelect(format.type)}/>
        }
    );
}
