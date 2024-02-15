import {Form, Select, Space} from "antd";
import {FUNCTIONS} from "./config.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns} from "../../../Queries/monday.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

function ColumnSelector({onChange, types}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {data: columns} = useQuery({
        queryKey: ["columns"],
        queryFn: () => getBoardColumns({boardId, types})
    });

    const options = columns?.map(column => ({label: column.title, value: column.id}));

    console.log(columns);
    return <Form.Item label="Column">
        <Select options={options}
                popupMatchSelectWidth={false}
                onChange={onChange}/>
    </Form.Item>
}

export default function Criteria({data, setData}) {
    const {column, value, timespan} = data;
    const func = FUNCTIONS.find(f => f.value === data.func);

    const critirias = {
        column: {
            label: "Column",
            value: column,
            changeFunction: setColumn,
            component: ColumnSelector
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
            return cretiria.component({
                onChange: cretiria.changeFunction,
                types: "numbers"
            });
        })}
    </Space>
}