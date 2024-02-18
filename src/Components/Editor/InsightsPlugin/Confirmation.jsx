import {Avatar, Button, Flex, Form, Input, Space, Typography} from "antd";
import InsightsLogo from "../../../insights.svg";
import {FUNCTIONS} from "./config.jsx";

const {Text} = Typography;
export default function Confirmation({data, setData, decreaseStep, insertInsight, setStep}) {
    const {title} = data;

    function setTitle(title) {
        setData((oldData) => ({...oldData, title: title}))
    }

    function clear() {
        setData({title:"Insight"})
        setStep(0)
    }

    function sentence() {
        const func = FUNCTIONS.find((func => func.value === data.func));
        return <Flex wrap="wrap" gap="small" style={{width: "50%"}}>
            {func.criteria.map((criterion, index) => {
                if (criterion.startsWith("__") && criterion.endsWith("__")) {
                    criterion = criterion.replaceAll("_", "").toLowerCase();
                    return <Text key={`cri-${index}`} style={{fontSize: "24px"}}>{data[criterion].label}</Text>;
                } else {
                    criterion = criterion.replaceAll("_", "");
                    return <Text key={`cri-${index}`} style={{fontSize: "24px"}}>{criterion}</Text>;
                }
            })}
            {data.filters?.map((filter, index) => {
                return [
                    <Text key={`fil-1-${index}`} style={{fontSize: "24px"}}>{index === 0 ? "where" : "and"}</Text>,
                    <Text key={`fil-column-${index}`} style={{fontSize: "24px"}}>{filter.column.label}</Text>,
                    <Text key={`fil-condition-${index}`} style={{fontSize: "24px"}}>{filter.condition.label}</Text>,
                    <Text key={`fil-value-${index}`} style={{fontSize: "24px"}}>{filter.value.label}</Text>,
                ]
            })}
        </Flex>
    }

    function preview() {
        return <Space direction="vertical" size={0}>
            <Form.Item label="name" style={{marginBottom: 0}}>
                <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </Form.Item>
            <Input.TextArea value="Some example data" disabled/>
        </Space>
    }

    function buttons() {
        return <Space>
            <Button type="default"
                    onClick={clear}>
                Clear
            </Button>
            <Button type="default"
                    onClick={decreaseStep}>
                Back
            </Button>
            <Button type="primary"
                    onClick={insertInsight}>
                <Space>
                    <Avatar shape="square" src={InsightsLogo} size={24}/>
                    <Text style={{color: "white"}}>Generate</Text>
                </Space>
            </Button>
        </Space>
    }

    return <Space direction="vertical" style={{width: "100%", textAlign: "center"}}>
        <Flex justify="space-evenly">
            {sentence()}
            {preview()}
        </Flex>
        {buttons()}
    </Space>
}