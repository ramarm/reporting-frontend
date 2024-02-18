import {Button, Flex, Form, Select, Space, Typography} from "antd";
import {useEffect, useState} from "react";
import {FUNCTIONS} from "./config.jsx";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardGroups, getBoardUsers} from "../../../Queries/monday.js";

const {Text} = Typography;
const SUPPORTED_FILTER_COLUMNS = ["status", "people", "date", "dropdown", "date"];

function FuncSelector({value, onChange, hoverFunc}) {
    const options = FUNCTIONS.map(func => ({label: func.title, value: func.value}));

    return <Select size="large"
                   className={"sentence-select"}
                   suffixIcon={null}
                   options={options}
                   placeholder="Choose function"
                   variant="borderless"
                   popupMatchSelectWidth={false}
                   value={hoverFunc || value}
                   onChange={onChange}
                   showSearch
                   filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
}
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

function Filter({index, filter, addFilter, removeFilter, updateFilter, columns}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [columnSettings, setColumnSettings] = useState();

    const {data: groups} = useQuery({
        queryKey: ["groups"],
        enabled: filter.column?.type === "group",
        queryFn: () => getBoardGroups({boardId})
    });
    const {data: subscribers} = useQuery({
        queryKey: ["subscribers"],
        enabled: filter.column?.type === "people",
        queryFn: () => getBoardUsers({boardId})
    });
    const {data: column} = useQuery({
        queryKey: ["column", filter.column?.value],
        enabled: ["status", "dropdown"].includes(filter.column?.type),
        queryFn: () => getBoardColumns({boardId, columnIds: [filter.column?.value]})
    });

    useEffect(() => {
        if (column) {
            setColumnSettings(JSON.parse(column[0].settings_str));
        }
    }, [column]);

    function getStatusOptions() {
        const options = [];
        if (columnSettings) {
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
                options.push({label, value: index});
            });
            if (!Object.keys(columnSettings.labels).includes("5")) {
                options.push({label: "(Default)", value: 5});
            }
        }
        return options;
    }

    const columnTypeMapping = {
        group: {
            conditions: [
                {label: "Is", value: "is", text: "is"}
            ],
            options: groups?.map(group => ({label: group.title, value: group.id}))
        },
        status: {
            conditions: [
                {label: "Is", value: "any_of", text: "is"},
                {label: "Is not", value: "not_any_of", text: "is not"}
            ],
            options: filter.column?.type === "status" && getStatusOptions()
        },
        dropdown: {
            conditions: [
                {label: "Is", value: "any_of", text: "is"},
                {label: "Is not", value: "not_any_of", text: "is not"}
            ],
            options: filter.column?.type === "dropdown" && columnSettings?.labels?.map(label => ({
                label: label.name,
                value: label.id
            }))
        },
        people: {
            conditions: [
                {label: "Is", value: "any_of", text: "is"},
                {label: "Is not", value: "not_any_of", text: "is not"}
            ],
            options: subscribers?.map(subscriber => ({
                label: subscriber.name,
                value: `${subscriber.type}-${subscriber.id}`
            }))
        },
        date: {
            conditions: [
                {label: "Is", value: "any_of", text: "is"},
                {label: "Is not", value: "not_any_of", text: "is not"},
                {label: "Is before", value: "greater_than_or_equals", text: "is before"},
                {label: "Is after", value: "lower_than_or_equal", text: "is after"}
            ],
            options: [
                {label: "Today", value: "TODAY"},
                {label: "Yesterday", value: "YESTERDAY"},
                {label: "Tomorrow", value: "TOMORROW"},
                {label: "This week", value: "THIS_WEEK"},
                {label: "Last week", value: "ONE_WEEK_AGO"},
                {label: "Next week", value: "ONE_WEEK_FROM_NOW"},
                {label: "This month", value: "THIS_MONTH"},
                {label: "Last month", value: "ONE_MONTH_AGO"},
                {label: "Next month", value: "ONE_MONTH_FROM_NOW"},
                {label: "Past dates", value: "PAST_DATETIME"},
                {label: "Future dates", value: "FUTURE_DATETIME"},
                {label: "Blank", value: "$$$blank$$$"}
            ]
        }
    }

    return <Space>
        <Text style={{fontSize: "24px"}}>{index === 0 ? "Where" : "And"}</Text>
        <Select placeholder="Column"
                size="large"
                className="sentence-select"
                suffixIcon={null}
                popupMatchSelectWidth={false}
                variant="borderless"
                options={columns}
                value={filter.column?.value}
                onChange={(_, option) => updateFilter("column", option)}
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
        <Select placeholder="Condition"
                className="sentence-select"
                suffixIcon={null}
                popupMatchSelectWidth={false}
                variant="borderless"
                disabled={!filter.column}
                options={columnTypeMapping[filter.column?.type]?.conditions}
                value={filter.condition?.value}
                onChange={(_, option) => updateFilter("condition", option)}/>
        <Select placeholder="Value"
                className="sentence-select"
                suffixIcon={null}
                popupMatchSelectWidth={false}
                variant="borderless"
                disabled={!filter.column}
                options={columnTypeMapping[filter.column?.type]?.options}
                value={filter.value?.value}
                onChange={(_, option) => updateFilter("value", option)}
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
        <Button icon={<PlusOutlined/>} type="text"
                onClick={addFilter}/>
        <Button icon={<DeleteOutlined/>} type="text"
                onClick={removeFilter}/>
    </Space>
}

export default function Configuration({data, setData, increaseStep, isReady}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [hoverFunc, setHoverFunc] = useState()
    const {filters} = data;
    const chosenFunc = FUNCTIONS.find((func => func.value === data.func));

    const {data: columns} = useQuery({
        queryKey: ["column", SUPPORTED_FILTER_COLUMNS],
        queryFn: () => getBoardColumns({boardId, types: SUPPORTED_FILTER_COLUMNS})
    });

    const critics = {
        __FUNC__: {
            value: hoverFunc || data.func,
            component: <FuncSelector value={data.func} onChange={setFunc} hoverFunc={hoverFunc}/>
        },
        __COLUMN__: {
            value: data.column,
            component: <ColumnSelector value={data.column} onChange={setColumn}
                                       types={chosenFunc?.supportedColumnTypes}/>
        },
        __VALUE__: {
            value: data.value,
            component: <ValueSelector column={data.column} value={data.value} onChange={setValue}/>
        },
        __TIMESPAN__: {
            value: data.timespan,
            component: <TimespanSelector value={data.timespan} onChange={setTime}/>
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

    function sentence() {
        if (!(hoverFunc || data.func)) {
            return <Text
                style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4)", textAlign: "center"}}>
                Choose a function
            </Text>;
        }
        const func = FUNCTIONS.find((func => func.value === (hoverFunc || data.func)));


        return <Space>
            {func?.criteria?.map((criterion, index) => {
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
    }

    function setFunc(func) {
        setData((oldData) => ({...oldData, func: func}));
        setHoverFunc(undefined);
    }

    function functions() {
        return <Flex wrap="wrap" gap="small" justify="space-evenly" align="center">
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
    }

    function addFilter() {
        if (filters) {
            setData((oldData) => ({
                ...oldData, filters: [...filters, {
                    column: null,
                    condition: null,
                    value: null
                }]
            }));
        } else {
            setData((oldData) => ({
                ...oldData, filters: [{
                    column: null,
                    condition: null,
                    value: null
                }]
            }));
        }
    }

    function updateFilter(index, key, value) {
        if (key === "column") {
            setData((oldData) => ({
                ...oldData,
                filters: filters.map((filter, i) => i === index ? {
                    ...filter,
                    [key]: value,
                    condition: null,
                    value: null
                } : filter)
            }));
        } else {
            setData((oldData) => ({
                ...oldData, filters: filters.map((filter, i) => i === index ? {...filter, [key]: value} : filter)
            }));
        }
    }

    function removeFilter(index) {
        setData((oldData) => ({
            ...oldData, filters: filters.filter((_, i) => i !== index)
        }));
    }

    function extra() {
        if (!filters?.length > 0) {
            return <Button icon={<PlusOutlined/>}
                           type="text"
                           onClick={addFilter}>
                Add first filter
            </Button>
        }
    }

    function getColumnOption() {
        const isGroupSelected = filters?.some(filter => filter.column?.type === "group");
        return [
            {label: "Group", value: "__GROUP__", type: "group", disabled: isGroupSelected},
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...columns?.map(column => ({label: column.title, value: column.id, type: column.type}))
        ]
    }

    function filtersScreen() {
        return <Space direction="vertical">
            {filters?.map((filter, index) => <Filter key={index}
                                                     index={index}
                                                     filter={filter}
                                                     addFilter={addFilter}
                                                     removeFilter={() => removeFilter(index)}
                                                     updateFilter={(key, value) => updateFilter(index, key, value)}
                                                     columns={getColumnOption()}/>)}
        </Space>
    }

    function buttons() {
        return <Space>
            <Button onClick={() => setData({title: "Insight"})}>
                Clear
            </Button>
            <Button type="primary"
                    disabled={!isReady}
                    onClick={() => increaseStep(1)}>
                Next
            </Button>
        </Space>
    }

    return <Space direction="vertical" style={{textAlign: "center", width: "100%"}}>
        {sentence()}
        {filtersScreen()}
        {data.func ? extra()
            : functions()}
        {data.func && buttons()}
    </Space>
}