import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useState} from "react";
import {$getSelection, $isRangeSelection} from "lexical";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {Button, Dropdown, Tooltip} from "antd";

const FONT_SIZE_PROPERTY = 'font-size';
const DEFAULT_FONT_SIZE = '12px';

const FONT_SIZE_OPTIONS = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px',
    '36px', '48px']

export default function FontSizePlugin() {
    const [editor] = useLexicalComposerContext()
    const [selectedFontSize, setSelectedFontSize] = useState(DEFAULT_FONT_SIZE);

    const fontSizes = FONT_SIZE_OPTIONS.map((fontSize, index) => {
        return {
            key: index,
            onClick: () => handleClick(fontSize),
            label: (<span style={{fontSize: fontSize}}>{fontSize}</span>)
        }
    });

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let selectionFontSize = $getSelectionStyleValueForProperty(selection, FONT_SIZE_PROPERTY, DEFAULT_FONT_SIZE);
                if (!selectionFontSize) selectionFontSize = "Mixed";
                if (selectedFontSize !== selectionFontSize) setSelectedFontSize(selectionFontSize);
            }
        });
    });

    function handleClick(option) {
        setSelectedFontSize(option);
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    [FONT_SIZE_PROPERTY]: option,
                });
            }
        });
    }


    return (
        <Dropdown
            trigger={editor.isEditable() ? 'click' : ''}
            placement={"bottom"}
            menu={{
                items: fontSizes,
                style: {maxHeight: "200px", overflow: "auto"}
            }}>
            <Tooltip title="Font Size" placement="bottom">
                <Button className="toolbar-button"
                        type="text"
                        disabled={!editor.isEditable()}>{selectedFontSize}</Button>
            </Tooltip>
        </Dropdown>

    );
}

