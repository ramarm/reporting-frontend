import {Button, Flex, Select, Space, Typography} from "antd";
import {FUNCTIONS} from "./config.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBoardColumns, getBoardGroups, getBoardUsers} from "../../../Queries/monday.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import "./InsightsPlugin.css";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

const {Text} = Typography;

const SUPPORTED_FILTER_COLUMNS = ["status", "people", "date", "dropdown"];

function Filter({index, filter, addFilter, removeFilter, updateFilter, columns}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
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
        },
        dropdown: {
            conditions: [
                {label: "Is", value: "any_of", text: "is"},
                {label: "Is not", value: "not_any_of", text: "is not"}
            ],
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
                onChange={(_, option) => updateFilter(index, "value", option)}
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}/>
        <Button icon={<PlusOutlined/>} type="text"
                onClick={addFilter}/>
        <Button icon={<DeleteOutlined/>} type="text"
                onClick={removeFilter}/>
    </Space>
}

export default function Filters({data, setData, increaseStep, decreaseStep}) {
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const {filters} = data;

    const {data: columns} = useQuery({
        queryKey: ["column", SUPPORTED_FILTER_COLUMNS],
        queryFn: () => getBoardColumns({boardId, types: SUPPORTED_FILTER_COLUMNS})
    });

    function getColumnOption() {
        const isGroupSelected = filters?.some(filter => filter.column?.type === "group");
        return [
            {label: "Group", value: "__GROUP__", type: "group", disabled: isGroupSelected},
            // eslint-disable-next-line no-unsafe-optional-chaining
            ...columns?.map(column => ({label: column.title, value: column.id, type: column.type}))
        ]
    }

    function sentence() {
        const chosenFunc = data.func;
        if (!chosenFunc) {
            return <Text
                style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4)", textAlign: "center"}}>
                Choose a function
            </Text>;
        }
        const func = FUNCTIONS.find((func => func.value === chosenFunc));
        return func.sentence(data);
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

    function noFiltersScreen() {
        return <Button icon={<PlusOutlined/>}
                       type="text"
                       onClick={addFilter}>
            Add first filter
        </Button>
    }

    return <Flex direction="vertical" vertical align="center" justify="space-evenly" gap="small"
                 style={{width: "100%", height: "100%"}}>
        {sentence()}
        <Space direction="vertical">
            {filters?.length > 0 ? filters.map((filter, index) => <Filter key={index}
                                                                          index={index}
                                                                          filter={filter}
                                                                          addFilter={addFilter}
                                                                          removeFilter={() => removeFilter(index)}
                                                                          updateFilter={(key, value) => updateFilter(index, key, value)}
                                                                          columns={getColumnOption()}/>)
                : noFiltersScreen()}
        </Space>
        <Space>
            <Button type="default"
                    onClick={decreaseStep}>
                Back
            </Button>
            <Button type="primary"
                    onClick={increaseStep}>
                {filters?.length > 0 ? "Next" : "Skip"}
            </Button>
        </Space>
    </Flex>
}