import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button, Col, Row, Tooltip} from "antd";
import {BsEmojiSmile} from "react-icons/bs";
import {useRef, useState} from "react";
import useOutsideClick from "./Toolbar/ClickOutsideHook";
import {$getSelection, $isRangeSelection} from "lexical";

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


export default function EmojiPlugin() {
    const [editor] = useLexicalComposerContext()
    const ref = useRef();
    const [visible, setVisible] = useState(false)

    useOutsideClick(ref, () => {
        setVisible(false);
    });

    function insertEmoji(emoji) {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.insertText(emoji);
            }
        });
    }

    function emojisChunks(emojis) {
        const chunkSize = 6;
        const chunks = [];
        for (let i = 0; i < emojis.length; i += chunkSize) {
            chunks.push(emojis.slice(i, i + chunkSize));
        }
        return chunks;
    }

    return (
        <div ref={ref}>
            <Tooltip title="Emoji" placement="bottom">
                <Button className={"toolbar-button"}
                        type="text"
                        disabled={!editor.isEditable()}
                        icon={<BsEmojiSmile/>}
                        onClick={() => setVisible(!visible)}/>
            </Tooltip>
            {visible && (
                <div className="toolbar-float" style={{height: "200px", overflow: "auto"}}>
                    {emojisChunks(SUPPORTED_EMOJIS).map((chunk, i) => {
                        return <Row key={i} gutter={[8, 8]}>
                            {
                                chunk.map((emoji, j) => {
                                    return <Col key={j} span={4}>
                                        <Button className="emoji-button"
                                        onClick={() => insertEmoji(emoji)}>{emoji}</Button>
                                    </Col>
                                })
                            }
                        </Row>
                    })}
                </div>
            )}
        </div>
    )
}