import {Button, Flex, Form, Space, Typography} from "antd";
import {useState} from "react";
import {InfoCircleOutlined} from "@ant-design/icons";
import {FUNCTIONS} from "./config.jsx";

const {Text} = Typography;
export default function ChooseFunction({data, setData}) {
    const [hoverFunc, setHoverFunc] = useState()


    function setFunc(func) {
        setData((oldData) => ({...oldData, "func": func}))
    }

    return <Space>
        <Flex wrap="wrap" gap="middle" justify="space-evenly" align="center">
            {FUNCTIONS.map((func, index) => {
                return <Form.Item key={index}>
                    <Button type={data?.func === func.value ? "primary" : "default"}
                            onClick={() => setFunc(func.value)}
                            onMouseEnter={() => setHoverFunc(func.value)}
                            onMouseLeave={() => setHoverFunc(undefined)}>
                        {func.title}
                    </Button>
                </Form.Item>
            })}
        </Flex>
        <div style={{width: "250px"}}>
            {hoverFunc && <Space direction="vertical" style={{textAlign: "center", width: "250px"}}>
                <InfoCircleOutlined/>
                <Text>{FUNCTIONS.find((func => func.value === hoverFunc))?.description}</Text>
            </Space>}
        </div>
    </Space>
}