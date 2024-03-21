import {Flex, Box, Loader, Text} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {useQuery} from "@tanstack/react-query";
import {calculateInsight} from "../../../Queries/insights.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {useEffect, useState} from "react";

export default function Preview({insightData, chosenFunction}) {
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
                    : typeof item.result === "number" ? (Math.round(item.result * 100) / 100).toLocaleString() : item.result}
            </li>)}
        </ul>
    }

    useEffect(() => {
        if (previewData) {
            const {result: res} = previewData;
            if (Array.isArray(res)) {
                setResult(parseArrayResult(res));
            } else {
                setResult(<Text
                    type={Text.types.TEXT1}>{typeof res === "number" ? (Math.round(res * 100) / 100).toLocaleString() : res}</Text>);
            }
        }
    }, [previewData]);

    function getSentence() {
        return chosenFunction.parts?.map((part, index) => {
            if (part.type === "text") {
                return <Heading key={index}
                                type={Heading.types.H3}
                                weight={Heading.weights.LIGHT}>
                    {part.text}
                </Heading>
            }
            return <Heading key={index}
                            type={Heading.types.H3}
                            weight={Heading.weights.LIGHT}
                            style={{textDecoration: "underline"}}>
                {insightData[part.type]?.label}
            </Heading>
        })
    }

    function getFilters() {
        return [insightData.filters.map((filter, index) => {
            return [<Heading key={index + "type"} type={Heading.types.H3}
                             weight={Heading.weights.LIGHT}>
                {index === 0 ? "where" : "and"}
            </Heading>,
                <Heading key={index + "column"} type={Heading.types.H3}
                         weight={Heading.weights.LIGHT}
                         style={{textDecoration: "underline"}}>
                    {filter.column.label}
                </Heading>,
                <Heading key={index + "condition"} type={Heading.types.H3}
                         weight={Heading.weights.LIGHT}
                         style={{textDecoration: "underline"}}>
                    {filter.condition.label}
                </Heading>,
                <Heading key={index + "value"} type={Heading.types.H3}
                         weight={Heading.weights.LIGHT}
                         style={{textDecoration: "underline"}}>
                    {filter.value.label}
                </Heading>]
        })]
    }

    function getBreakdown() {
        return [<Heading key="breakdown-text"
                         type={Heading.types.H3}
                         weight={Heading.weights.LIGHT}>
            and break it down by
        </Heading>,
            <Heading key="breakdown-value"
                     type={Heading.types.H3}
                     weight={Heading.weights.LIGHT}
                     style={{textDecoration: "underline"}}>
                {insightData.breakdown.label}
            </Heading>]
    }

    return <Flex gap={Flex.gaps.LARGE} justify={Flex.justify.SPACE_AROUND} style={{width: "100%"}}>
        <Flex id="insight-preview-sentence" gap={Flex.gaps.XS} wrap={true}>
            {getSentence()}
            {insightData.filters.length > 0 && getFilters()}
            {insightData.breakdown && getBreakdown()}
        </Flex>
        <Box id="insight-preview-box"
             className={(Array.isArray(previewData?.result) && !isFetchingPreview) ? null : "preview-align-center"}
             border={Box.borders.DEFAULT}
             shadow={Box.shadows.SMALL}
             rounded={Box.roundeds.MEDIUM}
             scrollable={true}>
            {isFetchingPreview
                ? <Loader size={Loader.sizes.MEDIUM}/>
                : result}
        </Box>
    </Flex>
}