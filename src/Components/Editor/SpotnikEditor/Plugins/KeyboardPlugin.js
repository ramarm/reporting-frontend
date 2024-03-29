import {useEffect} from 'react'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {$getSelection, $isParagraphNode, COMMAND_PRIORITY_HIGH, KEY_MODIFIER_COMMAND} from 'lexical'
import {$isListNode} from "@lexical/list";
import {$isHeadingNode} from "@lexical/rich-text";

export function getClosestElementNode(node) {
    if (!node) {
        return null;
    }
    if ($isParagraphNode(node) || $isListNode(node) || $isHeadingNode(node)) {
        return node;
    }
    return getClosestElementNode(node.getParent())
}

export default function KeyboardEventPlugin() {
    const [editor] = useLexicalComposerContext()

    const SUPPORTED_KEYS = ['ShiftRight', 'ShiftLeft', 'KeyE', 'KeyL', 'KeyR']


    useEffect(() => {
        return editor.registerCommand(
            KEY_MODIFIER_COMMAND,
            (payload) => {
                const {code, ctrlKey, metaKey} = payload;
                if (SUPPORTED_KEYS.includes(code) && (ctrlKey || metaKey)) {
                    payload.preventDefault()
                }
                const selection = $getSelection();
                selection.getNodes().forEach((node) => {
                    const elementNode = getClosestElementNode(node);
                    if ((ctrlKey || metaKey) && code === "ShiftLeft") {
                        elementNode.setDirection("ltr");
                    }
                    if ((ctrlKey || metaKey) && code === "ShiftRight") {
                        elementNode.setDirection("rtl");
                    }
                    if ((ctrlKey || metaKey) && code === "KeyL") {
                        elementNode.setFormat("left");
                    }
                    if ((ctrlKey || metaKey) && code === "KeyE") {
                        elementNode.setFormat("center");
                    }
                    if ((ctrlKey || metaKey) && code === "KeyR") {
                        elementNode.setFormat("right");
                    }
                });
                return false;
            },
            COMMAND_PRIORITY_HIGH, false
        );
    }, [editor]);
}