import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {$getSelection, COMMAND_PRIORITY_NORMAL, SELECTION_CHANGE_COMMAND} from "lexical";
import {$isInsightNode, InsightNode} from "./InsightNode.jsx";
import {Tooltip, IconButton, Flex, Box, Text, EditableText} from "monday-ui-react-core";
import {Delete, Duplicate, Edit, CloseSmall, Show} from "monday-ui-react-core/icons";
import {FUNCTIONS} from "./insightsFunctions.jsx";

function FloatingInsightEditor({editor, openModal, title, setTitle, getSentence, insightNode}) {
    const [isOpen, setIsOpen] = useState(true);
    const [position, setPosition] = useState({top: 0, left: 0});

    useEffect(() => {
        setIsOpen(true);
    }, [insightNode]);

    useEffect(() => {
        function updatePosition() {
            if (insightNode) {
                const element = editor.getElementByKey(insightNode.getKey())
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
    }, [insightNode]);

    function removeInsight() {
        setIsOpen(false);
        editor.update(() => {
            insightNode.remove();
        });
    }

    function duplicateInsight() {
        editor.update(() => {
            const newInsight = InsightNode.clone(insightNode);
            insightNode.insertAfter(newInsight);
        });
    }

    if (insightNode && isOpen && editor.isEditable()) {
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
                <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.XS} align={Flex.align.START}>
                    <Flex gap={Flex.gaps.MEDIUM} justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
                        <Flex gap={Flex.gaps.SMALL}>
                            <Tooltip content={getSentence()} style={{fontSize: 18}}>
                                <IconButton icon={Show}
                                            size={IconButton.sizes.XS}/>
                            </Tooltip>
                            <IconButton icon={Edit}
                                        size={IconButton.sizes.XS}
                                        onClick={openModal}/>
                            <IconButton icon={Duplicate}
                                        size={IconButton.sizes.XS}
                                        onClick={duplicateInsight}/>
                            <IconButton icon={Delete}
                                        size={IconButton.sizes.XS}
                                        onClick={removeInsight}/>
                        </Flex>
                        <IconButton icon={CloseSmall}
                                    size={IconButton.sizes.XS}
                                    onClick={() => setIsOpen(false)}/>
                    </Flex>
                    <Flex justify={Flex.justify.START} gap={Flex.gaps.SMALL}>
                        <Text type={Text.types.TEXT1}>Display text:</Text>
                        <EditableText type={EditableText.types.TEXT1} value={title} onChange={setTitle}/>
                    </Flex>
                </Flex>
            </Box>
        </div>
    }
}

export default function FloatingInsightEditorPlugin({
                                                        resetInsight,
                                                        setInsightData,
                                                        getSentence,
                                                        insightNode,
                                                        setInsightNode,
                                                        openModal,
                                                        editorElement
                                                    }) {
    const [editor] = useLexicalComposerContext();
    const [title, setTitle] = useState("");


    useEffect(() => {
        editor.update(() => {
            if (insightNode) insightNode.setTitle(title);
        });
    }, [title]);

    editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        const selection = $getSelection();
        if (selection) {
            const nodes = selection.getNodes();
            if (nodes.length === 1 && $isInsightNode(nodes[0])) {
                const node = nodes[0];
                const func = FUNCTIONS.find(f => f.value === node.getFunction());

                setTitle(node.getTitle());
                const _insightData = {
                    function: {label: func.title, value: func.value},
                    column: node.getColumn(),
                    value: node.getValue(),
                    timespan: node.getTimespan(),
                    filters: node.getFilters(),
                    breakdown: node.getBreakdown()
                }
                if (!_insightData.filters) _insightData.filters = [];
                setInsightData(_insightData);
                setInsightNode(nodes[0]);
            } else {
                resetInsight();
            }
        }
    }, COMMAND_PRIORITY_NORMAL)

    return createPortal(<FloatingInsightEditor editor={editor}
                                               openModal={openModal}
                                               insightNode={insightNode}
                                               getSentence={getSentence}
                                               title={title}
                                               setTitle={setTitle}/>,
        editorElement);
}
