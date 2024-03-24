import {$getSelection, $isRangeSelection} from "lexical";
import {$isLinkNode, toggleLink} from "@lexical/link";
import {useState} from "react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Dialog, DialogContentContainer, Flex, IconButton, TextField, Text, Button} from "monday-ui-react-core";
import {Link} from "monday-ui-react-core/icons";


function isLinkNode(node) {
    if (Array.isArray(node)) {
        return node.map(isLinkNode).some((x) => x);
    }
    if (!node) {
        return false;
    }
    if ($isLinkNode(node)) {
        return true;
    }
    return isLinkNode(node.getParent())
}

export default function LinkPlugin({containerSelector}) {
    const [editor] = useLexicalComposerContext()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState({});
    const [isLink, setIsLink] = useState(false);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                setIsLink(isLinkNode(selection.getNodes()));
            }
        });
    });

    function onOpen() {
        if (isLink) {
            handleLinkDelete();
        } else {
            setIsDialogOpen(true);
            const selectedText = getSelection().toString();
            setData({text: selectedText});
        }
    }

    function onClose() {
        setIsDialogOpen(false);
        setData({});
    }

    function handleLinkDelete() {
        editor.update(() => {
            toggleLink(null);
        });
    }

    function handleLinkInsert() {
        setIsDialogOpen(false);
        editor.update(() => {
            const selection = $getSelection();
            if (selection) {
                if ($isRangeSelection(selection)) {
                    if (data.text) {
                        selection.insertRawText(data.text);
                    } else {
                        selection.insertRawText(data.link);
                    }
                }
            }
            if ((!data.link.startsWith("http://") && !data.link.startsWith("https://"))) {
                data.link = "https://" + data.link;
            }
            toggleLink(data.link);
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
                           <Flex gap={Flex.gaps.SMALL}>
                               <Text type={Text.types.TEXT2} ellipsis={false}>Link</Text>
                               <TextField placeholder="Url"
                                          type={TextField.types.URL}
                                          onChange={(value) => setData((prev) => ({...prev, link: value}))}/>
                           </Flex>
                           <Flex gap={Flex.gaps.SMALL}>
                               <Text type={Text.types.TEXT2} ellipsis={false}>Text</Text>
                               <TextField placeholder="Display text"
                                          value={data.text ? data.text : data.link}
                                          onChange={(value) => setData((prev) => ({...prev, text: value}))}/>
                           </Flex>
                           <Flex gap={Flex.gaps.SMALL} style={{width: "100%"}}>
                               <Button size={Button.sizes.SMALL}
                                       disabled={!data.link}
                                       onClick={handleLinkInsert}
                                       style={{width: "100%"}}>Insert</Button>
                               <Button size={Button.sizes.SMALL}
                                       color={Button.colors.NEGATIVE}
                                       onClick={onClose}
                                       style={{width: "100%"}}>Cancel</Button>
                           </Flex>
                       </Flex>
                   </DialogContentContainer>}>
        <IconButton icon={Link}
                    active={isLink}
                    size={IconButton.sizes.SMALL}
                    disabled={!editor.isEditable()}
                    onClick={onOpen}/>
    </Dialog>
}