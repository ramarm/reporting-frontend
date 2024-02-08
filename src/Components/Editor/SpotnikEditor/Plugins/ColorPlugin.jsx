import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useRef, useState} from "react";
import {Button, ColorPicker} from "antd";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {$getSelection, $isRangeSelection} from "lexical";

const DEFAULT_COLOR = "#000000";
const SUPPORTED_COLORS = ['#000000', '#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee',
    '#808080', '#ffc0cb', '#a52a2a', '#800080', '#00ffff', '#ff00ff', '#00ff00', '#808000', '#800000', '#000080',
    '#008080', '#c0c0c0', '#ffd700', '#87ceeb', '#dc143c', '#ff7f50', '#d2691e', '#5f9ea0', '#deb887', '#7fffd4',
    '#006400', '#00008b', '#008b8b', '#a9a9a9', '#8b008b', '#556b2f', '#ff8c00', '#9932cc', '#8b0000', '#e9967a',
    '#9400d3', '#ff1493', '#00bfff', '#696969', '#1e90ff', '#b22222', '#228b22', '#ff00ff', '#dcdcdc', '#f8f8ff'];

export default function ColorPlugin({buttonIcon, targetStyle}) {
    const [editor] = useLexicalComposerContext()
    const ref = useRef();
    const [recentColors, setRecentColors] = useState([]);
    const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let markedColor = $getSelectionStyleValueForProperty(selection, targetStyle, DEFAULT_COLOR)
                if (!markedColor) markedColor = "Mixed";
                if (selectedColor !== markedColor) setSelectedColor(markedColor)
            }
        });
    });

    function onColorChange(color) {
        setRecentColors((colors) => {
            if (colors.includes(color)) {
                return colors;
            }
            return [color, ...colors];
        });
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {[targetStyle]: color.toHexString()});
            }
        });
    }


    return (
        <div ref={ref}>
            <ColorPicker onChangeComplete={onColorChange}
                         presets={[{
                             label: "Recommended Colors",
                             colors: SUPPORTED_COLORS,
                         },
                             {
                                 label: "Recent Colors",
                                 colors: recentColors,
                             }]}>
                <Button className="toolbar-button"
                        type="text"
                        disabled={!editor.isEditable()}
                        style={{color: selectedColor}}
                        icon={buttonIcon}/>
            </ColorPicker>
        </div>
    )
}