import {Button, Flex, Select, Space, Typography} from "antd";
import {FUNCTIONS} from "./config.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns} from "../../../Queries/monday.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

const {Text} = Typography;

function ColumnSelector({index, value, onChange, types}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {data: columns} = useQuery({
        queryKey: ["columns", types],
        queryFn: () => getBoardColumns({boardId, types})
    });

    const options = columns?.map(column => ({label: column.title, value: column.id}));

    return <Select key={index}
                   size="large"
                   className={"sentence-select"}
                   suffixIcon={null}
                   options={options}
                   placeholder="column"
                   variant="borderless"
                   popupMatchSelectWidth={false}
                   value={value?.value}
                   onChange={(_, option) => {
                       onChange(option)
                   }}
                   showSearch
                   filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
}

export default function Criteria({data, setData, increaseStep, decreaseStep}) {
    const {column, value, timespan} = data;
    const func = FUNCTIONS.find(f => f.value === data.func);

    const critics = {
        __COLUMN__: {
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

    function isReady() {
        const relevantCriteria = func.criteria.filter(criterion => criterion.startsWith("__") && criterion.endsWith("__"));
        return !relevantCriteria.every(criterion => critics[criterion].value);
    }

    return <Flex vertical align="center" justify="space-evenly" style={{width: "100%", height: "100%"}}>
        <Space>
            {func.criteria?.map((criterion, index) => {
                if (criterion.startsWith("__") && criterion.endsWith("__")) {
                    return <div key={index}>
                        {critics[criterion].component({
                            key: index,
                            value: critics[criterion].value,
                            onChange: critics[criterion].changeFunction,
                            types: ["numbers"]
                        })}
                    </div>
                }
                if (criterion.startsWith("_") && criterion.endsWith("_")) {
                    const criterionName = criterion.slice(1, -1);
                    return <Text key={index}
                                 style={{fontSize: "24px", textDecoration: "underline"}}>{criterionName}</Text>
                }
                return <Text key={index} style={{fontSize: "32px"}}>{criterion}</Text>
            })}
        </Space>
        <Space>
            <Button type="default"
                    onClick={decreaseStep}>
                Back
            </Button>
            <Button type="primary"
                    disabled={isReady()}
                    onClick={increaseStep}>
                Next
            </Button>
        </Space>
    </Flex>
}