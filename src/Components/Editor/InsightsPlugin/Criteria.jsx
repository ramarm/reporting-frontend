import {Form, Input, Space} from "antd";

export default function Criteria({data, setData}) {
    const {column, value} = data;

    function setColumn(column) {
        setData((oldData) => ({...oldData, "column": column}))
    }

    function setValue(value) {
        setData((oldData) => ({...oldData, "value": value}))
    }

    return <Space>
        <Form.Item label="Column">
            <Input value={column} onChange={(e) => setColumn(e.target.value)}/>
        </Form.Item>
        <Form.Item name="value" label="Value">
            <Input value={value} onChange={(e) => setValue(e.target.value)}/>
        </Form.Item>
    </Space>
}