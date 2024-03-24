import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {$getSelection, COMMAND_PRIORITY_NORMAL, SELECTION_CHANGE_COMMAND} from "lexical";
import {$isInsightNode} from "./InsightNode.jsx";
import {Flex, Box, Text, EditableText} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.jsx";

function FloatingInsightEditor({editor, selectedInsight}) {
    const [sentence, setSentence] = useState("");
    const [title, setTitle] = useState("");
    const [position, setPosition] = useState({top: 0, left: 0});

    useEffect(() => {
        function updatePosition() {
            if (selectedInsight) {
                const element = editor.getElementByKey(selectedInsight.getKey())
                if (element) {
                    const insightRect = element.getBoundingClientRect();
                    const modalRect = document.querySelector('.report-modal').getBoundingClientRect();
                    setPosition({
                        top: insightRect.top - modalRect.top + insightRect.height,
                        left: insightRect.left - modalRect.left - 20
                    });
                }
            }
        }

        updatePosition();
        window.addEventListener("resize", updatePosition);
        document.querySelector('.report-modal-content').addEventListener("scroll", updatePosition);
        return () => {
            window.removeEventListener("resize", updatePosition);
            document.querySelector('.report-modal-content')?.removeEventListener("scroll", updatePosition);
        }
    }, [selectedInsight]);

    editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
            const selection = $getSelection();
            if (selection) {
                const nodes = selection.getNodes();
                if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                    const insightNode = nodes[0];
                    const func = FUNCTIONS.find(f => f.value === insightNode.getFunction());
                    const column = insightNode.getColumn();
                    const value = insightNode.getValue();
                    const timespan = insightNode.getTimespan();
                    const filters = insightNode.getFilters();
                    const breakdown = insightNode.getBreakdown();
                    setTitle(insightNode.getTitle());

                    let _sentence = "";
                    func.parts.forEach(part => {
                        if (part.type === "text") _sentence += part.text + " ";
                        if (part.type === "column") _sentence += column.label + " ";
                        if (part.type === "value") _sentence += value.label + " ";
                        if (part.type === "timespan") _sentence += timespan.label + " ";
                    });
                    filters?.forEach((filter, index) => {
                        _sentence += index === 0 ? "where " : "and ";
                        _sentence += filter.column.label + " " + filter.condition.label + " " + filter.value.label + " ";
                    })
                    if (breakdown) {
                        _sentence += "and break it down by " + breakdown.label;
                    }
                    setSentence(_sentence);
                }
            }
        })
    });

    useEffect(() => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection) {
                const nodes = selection.getNodes();
                if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                    nodes[0].setTitle(title);
                }
            }
        });
    }, [title])

    if (selectedInsight) {
        return <div style={{
            position: "absolute",
            left: position.left,
            top: position.top,
            maxWidth: "300px"
        }}>
            <Box className="insight-editor-hover" shadow={Box.shadows.MEDIUM}
                 padding={Box.paddings.SMALL}
                 rounded={Box.roundeds.MEDIUM}
                 backgroundColor={Box.backgroundColors.PRIMARY_BACKGROUND_COLOR}>
                <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} align={Flex.align.START}>
                    <Flex gap={Flex.gaps.SMALL}>
                        <Text type={Text.types.TEXT1}>Title:</Text>
                        <EditableText type={EditableText.types.TEXT1} value={title} onChange={setTitle}/>
                    </Flex>
                    <Flex gap={Flex.gaps.SMALL}>
                        <Text type={Text.types.TEXT1}>Insight:</Text>
                        <Text type={Text.types.TEXT1}>{sentence}</Text>
                    </Flex>
                </Flex>
            </Box>
        </div>
    }
}

export default function FloatingInsightEditorPlugin({editorElement}) {
    const [editor] = useLexicalComposerContext();
    const [selectedInsight, setSelectedInsight] = useState(null);

    editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        const selection = $getSelection();
        if (selection) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                setSelectedInsight(nodes[0]);
            } else {
                setSelectedInsight(null);
            }
        }
    }, COMMAND_PRIORITY_NORMAL)

    return createPortal(<FloatingInsightEditor editor={editor} selectedInsight={selectedInsight}/>,
        editorElement);
}