import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useState} from "react";
import {$getSelection, $isRangeSelection} from "lexical";
import {
    IconButton,
    Button,
    Dialog,
    DialogContentContainer,
    Flex
} from "monday-ui-react-core";
import {Emoji} from "monday-ui-react-core/icons";

const SUPPORTED_EMOJIS = [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋",
    "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤨",
    "🧐", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌",
    "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵",
    "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕",
    "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧",
    "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓",
    "😩", "😫", "🥱", "😤", "🤬", "👿", "💀", "☠️", "💩", "🤡",
    "👻", "👽", "👾", "🤖"];


export default function EmojiPlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function insertEmoji(emoji) {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.insertText(emoji);
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
                       <Flex justify={Flex.justify.SPACE_AROUND}
                             wrap={true}
                             style={{height: 150, width: 200, overflow: "auto"}}>
                           {SUPPORTED_EMOJIS.map((emoji, index) => {
                               return <Button key={index}
                                              kind={Button.kinds.TERTIARY}
                                              size={Button.sizes.SMALL}
                                              onClick={() => insertEmoji(emoji)}>
                                   {emoji}
                               </Button>
                           })}
                       </Flex>
                   </DialogContentContainer>}>
        <IconButton icon={Emoji}
                    size={IconButton.sizes.SMALL}
                    disabled={!editor.isEditable()}
                    onClick={() => setIsDialogOpen(true)}/>
    </Dialog>
}