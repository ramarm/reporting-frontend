export const FUNCTIONS = [
    {
        title: "Sum",
        value: "SUM",
        preview: "Sum column",
        calculateEndpoint: "/insight/number",
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
        configurationFields: ["column"]
    },
    {
        title: "Average",
        value: "AVG",
        preview: "Average column",
        calculateEndpoint: "/insight/number",
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
        configurationFields: ["column"]
    },
    {
        title: "Median",
        value: "MED",
        preview: "Median column",
        calculateEndpoint: "/insight/number",
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
        configurationFields: ["column"]
    },
    {
        title: "Minimum",
        value: "MIN",
        preview: "Minimum column",
        calculateEndpoint: "/insight/number",
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
        configurationFields: ["column"]
    },
    {
        title: "Maximum",
        value: "MAX",
        preview: "Maximum column",
        calculateEndpoint: "/insight/number",
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
        configurationFields: ["column"]
    },
    // {
    //     title: "List items",
    //     value: "LIST_ITEMS",
    //     preview: "List items",
    //     parts: [
    //         {
    //             type: "text",
    //             text: "List items"
    //         }
    //     ],
    //     configurationFields: []
    // },
    {
        title: "Count items",
        value: "COUNT",
        preview: "Count items",
        calculateEndpoint: "/insight/number",
        parts: [
            {
                type: "text",
                text: "Count items"
            }
        ],
        configurationFields: []
    },
    {
        title: "Count items created",
        value: "COUNT_CREATED_ITEMS",
        preview: "Count items created in time",
        calculateEndpoint: "/insight/created",
        parts: [
            {
                type: "text",
                text: "Count items created"
            },
            {
                type: "timespan"
            }
        ],
        configurationFields: ["timespan"]
    },
    {
        title: "Count changed items",
        value: "COUNT_CHANGED_ITEMS",
        preview: "Count items where column changed to value in time",
        calculateEndpoint: "/insight/changed",
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
        configurationFields: ["column", "value", "timespan"]
    }
]