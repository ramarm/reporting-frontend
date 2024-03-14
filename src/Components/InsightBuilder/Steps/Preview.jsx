import {Box, Loader, Text} from "monday-ui-react-core";
import {useQuery} from "@tanstack/react-query";
import {calculateInsight} from "../../../Queries/insights.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useEffect, useState} from "react";

export default function Preview({chosenFunction, insightData}) {
    const {
        boardId,
        account: {id: accountId},
        user: {id: userId}
    } = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [result, setResult] = useState();

    const {data: previewData, isFetching: isFetchingPreview} = useQuery({
        queryKey: ["result", insightData],
        queryFn: () => calculateInsight({
            uri: chosenFunction.calculateEndpoint,
            data: {
                accountId,
                userId,
                boardId,
                func: insightData.function.value,
                columnId: insightData.column?.value,
                groupId: insightData.filters.find(filter => filter.column.type === "group")?.value.value,
                timeSpan: insightData.timespan?.value,
                changedColumnId: insightData.column?.value,
                changedColumnType: insightData.column?.type,
                changedValue: insightData.value?.value,
                filters: insightData.filters
                    .filter(filter => filter.column.type !== "group")
                    .map(filter => ({
                        column: filter.column.value,
                        condition: filter.condition.value,
                        value: filter.value.value
                    })),
                breakdown: insightData.breakdown
            }
        }),
        staleTime: 0
    });

    function parseArrayResult(result) {
        return <ul className="preview-ul">
            {result.map((item, index) => <li key={index}>
                {item.link
                    ? <a href={item.link} target="_blank" rel="noreferrer">{item.text}</a>
                    : item.text}
                {item.result && Array.isArray(item.result)
                    ? parseArrayResult(item.result)
                    : item.result}
            </li>)}
        </ul>
    }

    useEffect(() => {
        if (previewData) {
            const {result: res} = previewData;
            if (Array.isArray(res)) {
                setResult(parseArrayResult(res));
            } else {
                setResult(<Text type={Text.types.TEXT1}>{res}</Text>);
            }
        }
    }, [previewData]);

    return <Box id="insight-preview-box"
                className={(Array.isArray(previewData?.result) && !isFetchingPreview) ? null : "preview-align-center"}
                border={Box.borders.DEFAULT}
                shadow={Box.shadows.SMALL}
                rounded={Box.roundeds.MEDIUM}
                scrollable={true}>
        {isFetchingPreview
            ? <Loader size={Loader.sizes.MEDIUM}/>
            : result}
    </Box>
}