export const FUNCTIONS = [
    {
        title: "Sum",
        value: "SUM",
        preview: "Sum column",
        parts: [
            {
                type: "text",
                text: "Sum"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["numbers"]
                }
            }
        ],
        hasConfiguration: true
    },
    {
        title: "Average",
        value: "AVERAGE",
        preview: "Average column",
        parts: [
            {
                type: "text",
                text: "Average"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["numbers"]
                }
            }
        ],
        hasConfiguration: true,
    },
    {
        title: "Median",
        value: "MEDIAN",
        preview: "Median column",
        parts: [
            {
                type: "text",
                text: "Median"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["numbers"]
                }
            }
        ],
        hasConfiguration: true
    },
    {
        title: "Minimum",
        value: "MIN",
        preview: "Minimum column",
        parts: [
            {
                type: "text",
                text: "Minimum"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["numbers"]
                }
            }
        ],
        hasConfiguration: true
    },
    {
        title: "Maximum",
        value: "MAX",
        preview: "Maximum column",
        parts: [
            {
                type: "text",
                text: "Maximum"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["numbers"]
                }
            }
        ],
        hasConfiguration: true
    },
    {
        title: "Count items",
        value: "COUNT_ITEMS",
        preview: "Count items",
        parts: [
            {
                type: "text",
                text: "Count items"
            }
        ],
        hasConfiguration: false
    },
    {
        title: "Count items created",
        value: "COUNT_CREATED_ITEMS",
        preview: "Count items created in time",
        parts: [
            {
                type: "text",
                text: "Count items created"
            },
            {
                type: "timespan"
            }
        ],
        hasConfiguration: true
    },
    {
        title: "Count changed items",
        value: "COUNT_CHANGED_ITEMS",
        preview: "Count items where column changed to value in time",
        parts: [
            {
                type: "text",
                text: "Count items where"
            },
            {
                type: "column",
                props: {
                    columnTypes: ["people", "status"]
                }
            },
            {
                type: "text",
                text: "changed to"
            },
            {
                type: "value"
            },
            {
                type: "timespan"
            }
        ],
        hasConfiguration: true
    }
]