import {Box, Loader} from "monday-ui-react-core";
import {useQuery} from "@tanstack/react-query";
import {calculateInsight} from "../../../Queries/insights.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";

export default function Preview({chosenFunction, insightData}) {
    const {boardId, account: {id: accountId}, user: {id: userId}} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {data: previewData, isLoading: isLoadingPreview} = useQuery({
        queryKey: ["result", insightData],
        queryFn: () => calculateInsight({
            uri: chosenFunction.calculateEndpoint,
            data: {
                accountId,
                userId,
                boardId,
                mondayToken: import.meta.env.VITE_MONDAY_API_KEY,
                func: insightData.function.value,
                columnId: insightData.column?.value,
                groupId: insightData.filters.find(filter => filter.column.type === "group")?.value.value,
                timeSpan: insightData.timespan?.value,
                changedColumnId: insightData.column?.value,
                changedColumnType: insightData.column?.type,
                changedValue: insightData.value?.value
            }
        }),
        onSuccess: () => {
            console.log("success");
        },
        onError: (err) => {
            console.log("err", err);
        }
    });

    return <Box id="insight-preview-box"
                border={Box.borders.DEFAULT}
                shadow={Box.shadows.SMALL}
                rounded={Box.roundeds.MEDIUM}
                scrollable={true}>
        {isLoadingPreview
            ? <Loader size={Loader.sizes.MEDIUM}/>
            : previewData?.result}
    </Box>
}