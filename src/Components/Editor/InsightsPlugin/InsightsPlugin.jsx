import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Avatar, Button, Flex, Form, Space, Steps, Typography} from "antd";
import {useEffect, useRef, useState} from "react";
import InsightsLogo from "../../../insights.svg";
import {$getSelection, $insertNodes} from "lexical";
import {$createInsightNode} from "./InsightsNode.jsx";
import {getClosestElementNode} from "../SpotnikEditor/Plugins/KeyboardPlugin.js";
import Criteria from "./Criteria.jsx";
import ChooseFunction from "./ChooseFunction.jsx";
import Confirmation from "./Confirmation.jsx";
import {FUNCTIONS} from "./config.jsx";

const {Text} = Typography;

export default function InsightsPlugin() {
    const [step, setStep] = useState(0);
    const [insightData, setInsightData] = useState({step: 0});
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
            title: "Choose Function",
            content: <ChooseFunction data={insightData}
                                     setData={setInsightData}
                                     setStep={setStep}/>
        },
        {
            title: "Criteria",
            disabled: !func || func.criteria.length === 0,
            content: <Criteria data={insightData}
                               setData={setInsightData}/>,
            buttons: <Space>
                <Button type="default"
                        onClick={decreaseStep}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={increaseStep}>
                    Next
                </Button>
            </Space>
        },
        {
            title: "Filter",
            disabled: !func,
            content: <h1>Here the user will choose filters</h1>,
            buttons: <Space>
                <Button type="default"
                        onClick={decreaseStep}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={increaseStep}>
                    Next
                </Button>
            </Space>
        },
        {
            title: "Breakdown",
            disabled: !func,
            content: <h1>Here the user will choose breakdowns</h1>,
            buttons: <Space>
                <Button type="default"
                        onClick={decreaseStep}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={increaseStep}>
                    Next
                </Button>
            </Space>
        },
        {
            title: "Confirmation",
            disabled: !validateInsight(),
            content: <Confirmation data={insightData} setData={setInsightData}/>,
            buttons: <Space>
                <Button type="default"
                        onClick={decreaseStep}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={insertInsights}>
                    <Space>
                        <Avatar shape="square" src={InsightsLogo} size={24}/>
                        <Text style={{color: "white"}}>Generate</Text>
                    </Space>
                </Button>
            </Space>
        }
    ]

    function validateInsight() {
        if (!func) {
            return false;
        }
        return func.criteria.every((criterion) => {
            return insightData[criterion];
        });
    }

    function resetSelector() {
        setInsightData({step: 0});
    }

    function closeWindow() {
        resetSelector();
        setVisible(false);
    }

    function insertInsights() {
        editor.update(() => {
            const selection = $getSelection();
            const hasElementNode = selection.getNodes().map(getClosestElementNode).some((node) => node);
            const nodesToInsert = [];
            if (!hasElementNode) {
                nodesToInsert.push(editor.createDivParagraphNode());
            }
            nodesToInsert.push($createInsightNode(insightData));
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
                        <div>
                            {steps[step].content}
                        </div>
                    </Flex>
                </Form>
            )}
        </div>
    )
}