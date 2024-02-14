import {Flex, Typography} from "antd";

const {Text} = Typography;

export const FUNCTIONS = [
    {
        title: "Sum",
        value: "SUM",
        description: "Sum of the values",
        criteria: ["column"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Sum</Text>
                {data.column ? <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                    : <Text
                        style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            </Flex>
        }
    },
    {
        title: "Average",
        value: "AVERAGE",
        description: "Average of the values",
        criteria: ["column"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Average</Text>
                {data.column ? <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                    : <Text
                        style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            </Flex>
        }
    },
    {
        title: "Median",
        value: "MEDIAN",
        description: "Median of the values",
        criteria: ["column"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Median</Text>
                {data.column ? <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                    : <Text
                        style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            </Flex>
        }
    },
    {
        title: "Minimum",
        value: "MIN",
        description: "Minimum value",
        criteria: ["column"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Minimum</Text>
                {data.column ? <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                    : <Text
                        style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            </Flex>
        }
    },
    {
        title: "Maximum",
        value: "MAX",
        description: "Maximum value",
        criteria: ["column"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Maximum</Text>
                {data.column ? <Text style={{fontSize: "24px", textDecoration: "underline"}}>{data.column}</Text>
                    : <Text
                        style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>}
            </Flex>
        }
    },
    {
        title: "Count items",
        value: "COUNT_ITEMS",
        description: "Number of items",
        criteria: [],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
            </Flex>
        }
    },
    {
        title: "Count created items",
        value: "COUNT_CREATED_ITEMS",
        description: "Number of items created",
        criteria: ["timespan"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count created items</Text>
                <Text style={{fontSize: "24px"}}>in</Text>
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>time</Text>
            </Flex>
        }
    },
    {
        title: "Count changed items",
        value: "COUNT_CHANGED_ITEMS",
        description: "Number of items changed",
        criteria: ["column", "value", "timespan"],
        getSentence: (data) => {
            return <Flex gap="small" wrap="wrap" justify="center" style={{marginBottom: "20px"}}>
                <Text style={{fontSize: "24px", textDecoration: "underline"}}>Count items</Text>
                <Text style={{fontSize: "24px"}}>where</Text>
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>column</Text>
                <Text style={{fontSize: "24px"}}>changed to</Text>
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>value</Text>
                <Text style={{fontSize: "24px"}}>in</Text>
                <Text style={{fontSize: "24px", textDecoration: "underline", color: "rgba(0,0,0,0.4"}}>time</Text>
            </Flex>
        }
    }
]