import {useState} from "react";
import {$getSelection, $isRangeSelection} from "lexical";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button, Dropdown, Tooltip} from "antd";

const DEFAULT_FONT = "Ariel";
const FONT_PROPERTY = 'font-family';

const SUPPORTED_FONTS = ['Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Avant Garde', 'Impact', 'Zapf Chancery', 'Apple Chancery', 'Optima', 'Hoefler Text', 'Florence', 'Brush Script', 'Sitka', 'Skia', 'Symbol', 'Webdings', 'Wingdings', 'Andale Mono', 'Consolas', 'Monaco', 'Lucida Console', 'Lucida Sans Unicode', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', 'FreeMono', 'Cutive Mono', 'Anonymous Pro', 'Inconsolata', 'Source Code Pro', 'Roboto', 'Open Sans', 'Lato', 'Oswald', 'PT Sans', 'PT Serif', 'Poppins', 'Raleway', 'Roboto Condensed', 'Ubuntu'];

export default function FontsPlugin() {
    const [editor] = useLexicalComposerContext()
    const [selectedFont, setSelectedFont] = useState(DEFAULT_FONT);

    const fonts = SUPPORTED_FONTS.map((font, index) => {
        return {
            key: index, onClick: () => handleClick(font), label: (<span style={{fontFamily: font}}>{font}</span>)
        }
    });

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let markedColor = $getSelectionStyleValueForProperty(selection, FONT_PROPERTY, DEFAULT_FONT)
                if (!markedColor) markedColor = "Mixed";
                if (selectedFont !== markedColor) setSelectedFont(markedColor)
            }
        });
    });

    function handleClick(font) {
        setSelectedFont(font);
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {[FONT_PROPERTY]: font});
            }
        });
    }

    return (
        <Dropdown
            trigger={editor.isEditable() ? 'click' : ''}
            placement="bottom"
            menu={{
                items: fonts,
                style: {maxHeight: "200px", overflow: "auto"}
            }}>
            <Tooltip title="Font" placement="bottom">
                <Button className="toolbar-button"
                        type="text"
                        disabled={!editor.isEditable()}
                        style={{
                            fontFamily: selectedFont, width: "100px", overflow: "hidden", padding: "2px 4px"
                        }}>{selectedFont}</Button>
            </Tooltip>
        </Dropdown>
    );
}