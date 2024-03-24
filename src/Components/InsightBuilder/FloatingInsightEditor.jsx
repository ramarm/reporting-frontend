import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {$getSelection, COMMAND_PRIORITY_NORMAL, SELECTION_CHANGE_COMMAND} from "lexical";
import {$isInsightNode} from "./InsightNode.jsx";
import {Box} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.jsx";

function FloatingInsightEditor({insightElement}) {
    const [position, setPosition] = useState({top: 0, left: 0});

    useEffect(() => {
        function updatePosition() {
            if (insightElement) {
                const insightRect = insightElement.getBoundingClientRect();
                const modalRect = document.querySelector('.report-modal').getBoundingClientRect();
                setPosition({
                    top: insightRect.top - modalRect.top + insightRect.height,
                    left: insightRect.left - modalRect.left
                });
            }
        }

        updatePosition();
        window.addEventListener("resize", updatePosition);
        document.querySelector('.report-modal-content').addEventListener("scroll", updatePosition);
        return () => {
            window.removeEventListener("resize", updatePosition);
            document.querySelector('.report-modal-content')?.removeEventListener("scroll", updatePosition);
        }
    }, [insightElement]);

    function generateSentence() {
        const func = FUNCTIONS.find(f => f.value === insightElement.getAttribute("insight-function"));
        const column = JSON.parse(insightElement.getAttribute("insight-column") || "{}");
        const value = JSON.parse(insightElement.getAttribute("insight-value") || "{}");
        const timespan = JSON.parse(insightElement.getAttribute("insight-timespan") || "{}");
        const filters = JSON.parse(insightElement.getAttribute("insight-filters") || "[]");
        const breakdown = JSON.parse(insightElement.getAttribute("insight-breakdown") || "{}");

        let sentence = "";
        func.parts.forEach(part => {
            if (part.type === "text") sentence += part.text + " ";
            if (part.type === "column") sentence += column.label + " ";
            if (part.type === "value") sentence += value.label + " ";
            if (part.type === "timespan") sentence += timespan.label + " ";
        });
        filters.forEach((filter, index) => {
            sentence += index === 0 ? "where " : "and ";
            sentence += filter.column.label + " " + filter.condition.label + " " + filter.value.label + " ";
        })
        if (Object.keys(breakdown).length > 0) {
            sentence += "and break it down by " + breakdown.label;
        }
        return sentence
    }

    if (insightElement) {
        return <div style={{
            position: "absolute",
            left: position.left,
            top: position.top,
            maxWidth: "300px"
        }}>
            <Box shadow={Box.shadows.MEDIUM}
                 padding={Box.paddings.SMALL}
                 rounded={Box.roundeds.MEDIUM}
                 backgroundColor={Box.backgroundColors.PRIMARY_BACKGROUND_COLOR}>
                {generateSentence()}
            </Box>
        </div>
    }
}

export default function FloatingInsightEditorPlugin({editorElement}) {
    const [editor] = useLexicalComposerContext();
    const [insightElement, setInsightElement] = useState(null);

    editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        const selection = $getSelection();
        if (selection) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                const insight = nodes[0];
                const element = editor.getElementByKey(insight.getKey())
                setInsightElement(element);
            } else {
                setInsightElement(null);
            }
        }
    }, COMMAND_PRIORITY_NORMAL)

    return createPortal(<FloatingInsightEditor insightElement={insightElement}/>,
        editorElement);
}