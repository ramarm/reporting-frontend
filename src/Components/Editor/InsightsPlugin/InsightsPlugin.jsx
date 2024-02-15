import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Avatar, Button, Flex, Form, Space, Steps, Typography} from "antd";
import {useRef, useState} from "react";
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
    const [insightData, setInsightData] = useState({});
    const [editor] = useLexicalComposerContext();
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const [step, setStep] = useState(0);

    const func = FUNCTIONS.find((func => func.value === insightData.func));

    const steps = [
        {
            title: "Choose Function",
            content: <ChooseFunction data={insightData}
                                     setData={setInsightData}/>,
            buttons: <Space>
                <Button type="primary"
                        disabled={!func}
                        onClick={() => setStep(oldStep => {
                            if (func.criteria.length > 0) return oldStep + 1
                            return oldStep + 2
                        })}>
                    Next
                </Button>
            </Space>
        },
        {
            title: "Criteria",
            disabled: !func || func.criteria.length === 0,
            content: <Criteria data={insightData}
                               setData={setInsightData}/>,
            buttons: <Space>
                <Button type="default"
                        onClick={() => setStep(oldStep => oldStep - 1)}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={() => setStep(oldStep => oldStep + 1)}>
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
                        onClick={() => setStep(oldStep => {
                            if (func.criteria.length > 0) return oldStep - 1
                            return oldStep - 2
                        })}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={() => setStep(oldStep => oldStep + 1)}>
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
                        onClick={() => setStep(oldStep => oldStep - 1)}>
                    Back
                </Button>
                <Button type="primary"
                        onClick={() => setStep(oldStep => oldStep + 1)}>
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
                        onClick={() => setStep(oldStep => oldStep - 1)}>
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

    function generateSentence() {
        if (!insightData.func) {
            return <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>
                Choose a function
            </Text>;
        }
        const func = FUNCTIONS.find((func => func.value === insightData.func));
        return func.getSentence(insightData);
    }

    function resetSelector() {
        setInsightData({});
        setStep(0);
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
                               onChange={setStep}
                               items={steps}/>
                        <Flex vertical align="center" justify="space-evenly" style={{width: "100%"}}>
                            {generateSentence()}
                            {steps[step].content}
                            {steps[step].buttons}
                        </Flex>
                    </Flex>
                </Form>
            )}
        </div>
    )
}