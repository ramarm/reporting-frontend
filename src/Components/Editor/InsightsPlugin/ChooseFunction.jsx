import {Button, Flex, Form, Typography} from "antd";
import {useState} from "react";
import {FUNCTIONS} from "./config.jsx";

const {Text} = Typography;
export default function ChooseFunction({data, setData, setStep}) {
    const [hoverFunc, setHoverFunc] = useState()

    function sentence() {
        const chosenFunc = hoverFunc || data.func;
        if (!chosenFunc) {
            return <Text
                style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4)", textAlign: "center"}}>
                Choose a function
            </Text>;
        }
        const func = FUNCTIONS.find((func => func.value === chosenFunc));
        return func.sentence(data);
    }

    function setFunc(func) {
        setData((oldData) => ({...oldData, "func": func}))
        const newFunc = FUNCTIONS.find((f => f.value === func));
        if (newFunc?.criteria.length === 0) {
            setStep((oldStep) => oldStep + 2);
        } else {
            setStep((oldStep) => oldStep + 1);
        }
    }

    return <Flex vertical align="center" justify="space-evenly" style={{height: "100%"}}>
        {sentence()}
        <Flex wrap="wrap" gap="small" justify="space-evenly" align="center">
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
    </Flex>
}