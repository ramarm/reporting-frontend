import {Form, Input, Space} from "antd";
import {FUNCTIONS} from "./config.jsx";

export default function Criteria({data, setData}) {
    const {column, value, timespan} = data;
    const func = FUNCTIONS.find(f => f.value === data.func);

    const critirias = {
        column: {
            label: "Column",
            value: column,
            changeFunction: setColumn
        },
        value: {
            label: "Value",
            value: value,
            changeFunction: setValue
        },
        timespan: {
            label: "Time",
            value: timespan,
            changeFunction: setTime
        }
    }

    function setColumn(column) {
        setData((oldData) => ({...oldData, "column": column}))
    }

    function setValue(value) {
        setData((oldData) => ({...oldData, "value": value}))
    }

    function setTime(time) {
        setData((oldData) => ({...oldData, "timespan": time}))
    }

    return <Space>
        {func.criteria?.map(c => {
            const cretiria = critirias[c];
            return <Form.Item key={cretiria.label} label={cretiria.label}>
                <Input value={cretiria.value} onChange={(e) => cretiria.changeFunction(e.target.value)}/>
            </Form.Item>
        })}
    </Space>
}