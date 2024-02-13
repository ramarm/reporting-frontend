import {Flex, Form, Input} from "antd";

export default function Confirmation({data, setData}) {
    const {title} = data;

    function setTitle(title) {
        setData((oldData) => ({...oldData, "title": title}))
    }

    return <Flex align="center" justify="space-evenly" style={{width:"100%"}}>
        <Form.Item label="Insight title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        </Form.Item>
        <Form.Item label="preview">
            <Input.TextArea value="Some example data" disabled/>
        </Form.Item>
    </Flex>
}