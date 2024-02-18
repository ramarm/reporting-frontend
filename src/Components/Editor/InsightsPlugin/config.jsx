import {Space, Typography} from "antd";

const {Text} = Typography;

export const FUNCTIONS = [
    {
        title: "Sum",
        value: "SUM",
        description: "Sum of the values",
        supportedColumnTypes: ["numbers"],
        supportFilter: true,
        criteria: ["_Sum_", "__COLUMN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Sum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Average",
        value: "AVERAGE",
        description: "Average of the values",
        supportedColumnTypes: ["numbers"],
        supportFilter: true,
        criteria: ["_Average_", "__COLUMN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Average</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Median",
        value: "MEDIAN",
        description: "Median of the values",
        supportedColumnTypes: ["numbers"],
        supportFilter: true,
        criteria: ["_Median_", "__COLUMN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Median</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Minimum",
        value: "MIN",
        description: "Minimum value",
        supportedColumnTypes: ["numbers"],
        supportFilter: true,
        criteria: ["_Minimum_", "__COLUMN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Minimum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Maximum",
        value: "MAX",
        description: "Maximum value",
        supportedColumnTypes: ["numbers"],
        supportFilter: true,
        criteria: ["_Maximum_", "__COLUMN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Maximum</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
        </Space>
    },
    {
        title: "Count items",
        value: "COUNT_ITEMS",
        description: "Number of items",
        supportFilter: true,
        criteria: [],
        sentence: () => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
        </Space>
    },
    {
        title: "Count items created",
        value: "COUNT_CREATED_ITEMS",
        description: "Number of items created",
        supportFilter: false,
        criteria: ["_Count created items_", "__TIMESPAN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items created</Text>
            {data.timespan ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.timespan.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>in time</Text>}
        </Space>
    },
    {
        title: "Count changed items",
        value: "COUNT_CHANGED_ITEMS",
        description: "Number of items changed",
        supportedColumnTypes: ["people", "status"],
        supportFilter: false,
        criteria: ["_Count items_", "where", "__COLUMN__", "changed to", "__VALUE__", "__TIMESPAN__"],
        sentence: (data) => <Space>
            <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
            <Text style={{fontSize: "24px"}}>where</Text>
            {data.column ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column.label}</Text> :
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            <Text style={{fontSize: "24px"}}>changed to</Text>
            {data.value ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.value.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>value</Text>}
            {data.timespan ?
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.timespan.label}</Text>
                : <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>in time</Text>}
        </Space>
    }
]