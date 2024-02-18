import {Button, Flex, Select, Space, Typography} from "antd";
import {FUNCTIONS} from "./config.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardUsers} from "../../../Queries/monday.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useEffect, useState} from "react";

const {Text} = Typography;

function ColumnSelector({value, onChange, types}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {data: columns} = useQuery({
        queryKey: ["columns", types],
        queryFn: () => getBoardColumns({boardId, types})
    });

    const options = columns?.map(column => ({label: column.title, value: column.id, type: column.type}));

    return <Select size="large"
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

function TimespanSelector({value, onChange}) {
    const options = [
        {
            label: "today",
            value: "TODAY"
        },
        {
            label: "yesterday",
            value: "YESTERDAY"
        },
        {
            label: "this week",
            value: "THIS_WEEK"
        },
        {
            label: "last week",
            value: "ONE_WEEK_AGO"
        },
        {
            label: "this month",
            value: "THIS_MONTH"
        },
        {
            label: "last month",
            value: "ONE_MONTH_AGO"
        },
        {
            label: "this quarter",
            value: "THIS_QUARTER"
        },
        {
            label: "last quarter",
            value: "LAST_QUARTER"
        },
        {
            label: "this year",
            value: "THIS_YEAR"
        },
        {
            label: "last year",
            value: "LAST_YEAR"
        },
        {
            label: "in last 24 hours",
            value: "LAST_24_HOURS"
        },
        {
            label: "in last 7 days",
            value: "LAST_7_DAYS"
        },
        {
            label: "in last 30 days",
            value: "LAST_30_DAYS"
        }
    ]

    return <Select size="large"
                   className={"sentence-select"}
                   suffixIcon={null}
                   options={options}
                   placeholder="in time"
                   variant="borderless"
                   popupMatchSelectWidth={false}
                   value={value?.value}
                   onChange={(_, option) => {
                       onChange(option)
                   }}
                   showSearch
                   filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
}

function ValueSelector({column: selectedColumn, value, onChange}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [options, setOptions] = useState([]);

    const {data: column} = useQuery({
        queryKey: ["column", selectedColumn?.value],
        enabled: !!selectedColumn,
        queryFn: () => getBoardColumns({boardId, columnIds: [selectedColumn?.value]})
    });

    const {data: subscribers} = useQuery({
        queryKey: ["subscribers"],
        queryFn: () => getBoardUsers({boardId})
    });

    useEffect(() => {
        if (column?.length === 1) {
            const type = column[0].type;
            const tempOptions = [{label: "anything", value: "__ANYTHING__"}];
            if (type === "people") {
                tempOptions.push(...subscribers.map(subscriber => ({label: subscriber.name, value: subscriber.id})));
            }
            if (type === "status") {
                const columnSettings = JSON.parse(column[0].settings_str)
                Object.keys(columnSettings.labels).forEach(key => {
                    const index = Number(key)
                    let label = columnSettings?.labels[index];
                    if (label === "") {
                        if (index === 5) {
                            label = "(Default)";
                        } else {
                            return;
                        }
                    }
                    tempOptions.push({label: label, value: index});
                });
                if (!Object.keys(columnSettings.labels).includes("5")) {
                    tempOptions.push({label: "(Default)", value: 5});
                }
            }
            setOptions(tempOptions);
        }
    }, [column]);

    return <Select size="large"
                   className={"sentence-select"}
                   suffixIcon={null}
                   options={options}
                   placeholder="value"
                   variant="borderless"
                   popupMatchSelectWidth={false}
                   value={value?.value}
                   onChange={(_, option) => {
                       onChange(option)
                   }}
                   showSearch
                   filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
}

export default function Criteria({data, setData, increaseStep, decreaseStep, isReady}) {
    const {column, value, timespan} = data;
    const func = FUNCTIONS.find(f => f.value === data.func);

    const critics = {
        __COLUMN__: {
            value: column,
            component: <ColumnSelector value={column} onChange={setColumn} types={func.supportedColumnTypes}/>
        },
        __VALUE__: {
            value: value,
            component: <ValueSelector column={column} value={value} onChange={setValue}/>
        },
        __TIMESPAN__: {
            value: timespan,
            component: <TimespanSelector value={timespan} onChange={setTime}/>
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


    return <Flex vertical align="center" justify="space-evenly" style={{width: "100%", height: "100%"}}>
        <Space>
            {func.criteria?.map((criterion, index) => {
                if (criterion.startsWith("__") && criterion.endsWith("__")) {
                    return <div key={index}>
                        {critics[criterion].component}
                    </div>
                }
                if (criterion.startsWith("_") && criterion.endsWith("_")) {
                    const criterionName = criterion.slice(1, -1);
                    return <Text key={index}
                                 style={{fontSize: "24px", textDecoration: "underline"}}>{criterionName}</Text>
                }
                return <Text key={index} style={{fontSize: "24px"}}>{criterion}</Text>
            })}
        </Space>
        <Space>
            <Button type="default"
                    onClick={decreaseStep}>
                Back
            </Button>
            <Button type="primary"
                    disabled={!isReady}
                    onClick={increaseStep}>
                Next
            </Button>
        </Space>
    </Flex>
}