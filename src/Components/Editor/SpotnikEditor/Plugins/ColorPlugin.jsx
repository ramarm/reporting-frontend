import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useState} from "react";
import {$getSelectionStyleValueForProperty, $patchStyleText} from "@lexical/selection";
import {$getSelection, $isRangeSelection} from "lexical";
import {Icon, Button, Dialog, DialogContentContainer, Flex} from "monday-ui-react-core";
import {TextColorIndicator} from "monday-ui-react-core/icons";

const COLOR_LIST = ["#037f4c", "#00c875", "#9cd326", "#cab641", "#ffcb00", "#fdab3d", "#ff642e", "#ffadad",
    "#ff7575", "#e2445c", "#bb3354", "#ff158a", "#ff5ac4", "#faa1f1", "#a25ddc", "#784bd1", "#7e3b8a", "#401694",
    "#5559df", "#225091", "#579bfc", "#0086c0", "#4eccc6", "#66ccff", "#68a1bd", "#e1e1e1", "#808080", "#7f5347"];


export default function ColorPlugin({containerSelector, defaultColor, buttonIcon, targetStyle, previewStyleTarget}) {
    const [editor] = useLexicalComposerContext()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(defaultColor);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let markedColor = $getSelectionStyleValueForProperty(selection, targetStyle, defaultColor)
                if (!markedColor) markedColor = "Mixed";
                if (selectedColor !== markedColor) setSelectedColor(markedColor)
            }
        });
    });

    function onColorChange(color) {
        setIsDialogOpen(false);
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {[targetStyle]: color});
            }
        });
    }

    return <Dialog open={isDialogOpen}
                   containerSelector={containerSelector}
                   position={Dialog.positions.BOTTOM}
                   onClickOutside={() => setIsDialogOpen(false)}
                   showTrigger={[]}
                   hideTrigger={[]}
                   content={() => <DialogContentContainer>
                       <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
                           <Button kind={Button.kinds.SECONDARY}
                                   leftIcon={buttonIcon}
                                   size={Button.sizes.SMALL}
                                   onClick={() => onColorChange(defaultColor)}>
                               Default
                           </Button>
                           <Flex gap={Flex.gaps.XS} justify={Flex.justify.SPACE_BETWEEN} style={{width: 250}}
                                 wrap={true}>
                               {COLOR_LIST.map((color) => <Button key={color}
                                                                  kind={Button.kinds.TERTIARY}
                                                                  size={Button.sizes.SMALL}
                                                                  style={{[previewStyleTarget]: color}}
                                                                  onClick={() => onColorChange(color)}>
                                   <Icon icon={TextColorIndicator}/>
                               </Button>)}
                           </Flex>
                       </Flex>
                   </DialogContentContainer>}>
        <Button size={Button.sizes.SMALL}
                kind={Button.kinds.TERTIARY}
                disabled={!editor.isEditable()}
                style={{color: selectedColor?.startsWith("#") ? selectedColor : "black"}}
                onClick={() => setIsDialogOpen(true)}>
            <Icon icon={buttonIcon} iconSize={20}/>
        </Button>
    </Dialog>
}