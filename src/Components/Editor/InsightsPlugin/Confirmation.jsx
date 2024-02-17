import {Avatar, Button, Flex, Form, Input, Space, Typography} from "antd";
import InsightsLogo from "../../../insights.svg";

const {Text} = Typography;
export default function Confirmation({data, setData, decreaseStep, insertInsight}) {
    const {title} = data;

    function setTitle(title) {
        setData((oldData) => ({...oldData, "title": title}))
    }

    return <Flex align="center" justify="space-evenly" style={{width: "100%"}}>
        <Form.Item label="Insight title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        </Form.Item>
        <Form.Item label="preview">
            <Input.TextArea value="Some example data" disabled/>
        </Form.Item>
        <Space>
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
    </Flex>
}