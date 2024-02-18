import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Avatar, Button, Flex, Form, Space, Steps, Typography} from "antd";
import {useRef, useState} from "react";
import InsightsLogo from "../../../insights.svg";
import {$createRangeSelection, $getSelection, $insertNodes} from "lexical";
import {getClosestElementNode} from "../SpotnikEditor/Plugins/KeyboardPlugin.js";
import {FUNCTIONS} from "./config.jsx";
import "./InsightsPlugin.css";
import {$createDivParagraphNode} from "../SpotnikEditor/Nodes/DivParagraphNode.jsx";
import Configuration from "./Configuration.jsx";
import Confirmation from "../InsightsPlugin/Confirmation.jsx";
import {$createInsightNode} from "../InsightsPlugin/InsightsNode.jsx";

const {Text} = Typography;

export default function InsightsPlugin2() {
    const [step, setStep] = useState(0);
    const [insightData, setInsightData] = useState({title: "Insight"});
    const [editor] = useLexicalComposerContext();
    const ref = useRef();
    const [visible, setVisible] = useState(false);

    const func = FUNCTIONS.find((func => func.value === insightData.func));

    function increaseStep() {
        if (step === 0 && func?.criteria.length === 0) {
            setStep((oldStep) => oldStep + 2);
        } else {
            setStep((oldStep) => oldStep + 1);
        }
    }

    function decreaseStep() {
        if (step === 2 && func?.criteria.length === 0) {
            setStep((oldStep) => oldStep - 2);
        } else {
            setStep((oldStep) => oldStep - 1);
        }
    }

    const steps = [
        {
            title: "Configuration",
            content: <Configuration data={insightData}
                                    setData={setInsightData}
                                    increaseStep={increaseStep}
                                    isReady={validateInsight()}/>
        },
        {
            title: "Confirmation",
            disabled: !validateInsight(),
            content: <Confirmation data={insightData}
                                   setData={setInsightData}
                                   decreaseStep={decreaseStep}
                                   insertInsight={insertInsight}
                                   setStep={setStep}/>
        }
    ]

    function validateInsight() {
        if (!func) {
            return false;
        }
        return func.criteria.every((criterion) => {
            if (criterion.startsWith("__") && criterion.endsWith("__")) {
                criterion = criterion.slice(2, -2).toLowerCase();
                return insightData[criterion] !== undefined;
            }
            return true;
        });
    }

    function resetSelector() {
        setInsightData({title:"Insight"});
        setStep(0);
    }

    function closeWindow() {
        resetSelector();
        setVisible(false);
    }

    function getDoneFilters() {
        return insightData.filters?.filter((filter) => filter.column !== undefined && filter.condition !== undefined && filter.value !== undefined);
    }

    function insertInsight() {
        editor.update(() => {
            let selection;
            selection = $getSelection();
            if (selection === null) {
                selection = $createRangeSelection();
            }
            const hasElementNode = selection.getNodes().map(getClosestElementNode).some((node) => node);
            const nodesToInsert = [];
            if (!hasElementNode) {
                nodesToInsert.push($createDivParagraphNode());
            }
            nodesToInsert.push($createInsightNode({
                title: insightData.title,
                func: insightData.func,
                column: JSON.stringify(insightData.column),
                filters: JSON.stringify(getDoneFilters()),
                value: JSON.stringify(insightData.value),
                timespan: JSON.stringify(insightData.timespan),
                breakdown: insightData.breakdown
            }));
            $insertNodes(nodesToInsert);
        })
        closeWindow();
    }

    return (
        <div ref={ref}>
            <Button className={"toolbar-button"}
                    type="primary"
                    onClick={() => {
                        if (editor.isEditable()) {
                            if (visible) {
                                closeWindow();
                            } else {
                                setVisible(true);
                            }
                        }
                    }}>
                <Space>
                    <Avatar shape="square" src={InsightsLogo} size={24}/>
                    <Text style={{color: "white"}}>Add Insight</Text>
                </Space>
            </Button>
            {visible && (
                <Form className="toolbar-float"
                      layout="vertical"
                      style={{textAlign: "left", width: "85%"}}>
                    <Flex>
                        <Steps style={{width: "20vw"}}
                               progressDot
                               current={step}
                               direction="vertical"
                               onChange={(step) => setStep(step)}
                               items={steps}/>
                        <div style={{width: "100%"}}>
                            {steps[step].content}
                        </div>
                    </Flex>
                </Form>
            )}
        </div>
    )
}