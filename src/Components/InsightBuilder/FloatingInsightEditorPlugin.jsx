import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$getSelection, COMMAND_PRIORITY_NORMAL, SELECTION_CHANGE_COMMAND} from "lexical";
import {useRef, useState} from "react";
import {$isInsightNode} from "./InsightNode.jsx";
import {createPortal} from "react-dom";
import {Text} from "monday-ui-react-core";

function setFloatingLocation(selectedElement, floatingElement, editorElement, verticalGap = 10, horizontalOffset = 5) {
    console.log(selectedElement, floatingElement, editorElement)
    const scrollerElem = editorElement.parentElement;

    if (selectedElement === null || !scrollerElem) {
        floatingElement.style.opacity = '0';
        floatingElement.style.transform = 'translate(-10000px, -10000px)';
        return;
    }

    const floatingElemRect = floatingElement.getBoundingClientRect();
    const anchorElementRect = editorElement.getBoundingClientRect();
    const editorScrollerRect = scrollerElem.getBoundingClientRect();

    let top = selectedElement.top - verticalGap;
    let left = selectedElement.left - horizontalOffset;

    if (top < editorScrollerRect.top) {
        top += floatingElemRect.height + selectedElement.height + verticalGap * 2;
    }

    if (left + floatingElemRect.width > editorScrollerRect.right) {
        left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
    }

    top -= anchorElementRect.top;
    left -= anchorElementRect.left;

    floatingElement.style.opacity = '1';
    floatingElement.style.transform = `translate(${left}px, ${top}px)`;
}

function FloatingInsightEditor({contentRef}) {
    const floatRef = useRef();
    const floatElement = floatRef.current;
    console.log(floatRef);

    // if (!floatElement) {
    //     return;
    // }

    // setFloatingLocation(insightElement, floatElement, contentRef);

    return <div ref={floatRef}>

        <Text type={Text.TEXT2}>I am sentence</Text>
    </div>
}

export default function FloatingInsightEditorPlugin({contentRef}) {
    const [editor] = useLexicalComposerContext();
    const [insightElement, setInsightElement] = useState();

    editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        const selection = $getSelection();
        if (selection) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                const insight = nodes[0];
                const element = editor.getElementByKey(insight.getKey())
                setInsightElement(element);
            } else {
                setInsightElement();
            }
        }
    }, COMMAND_PRIORITY_NORMAL);

    if (insightElement) {
        return createPortal(<FloatingInsightEditor contentRef={contentRef}/>, contentRef);
    }
}