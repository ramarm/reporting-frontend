import {useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {
    Flex,
    Text
} from "monday-ui-react-core";
import Owner from "./Owner.jsx";
import {DeleteReport, DuplicateReport, TakeOwnership} from "./ReportActionButtons.jsx";

export default function ReportHeader({reportId}) {
    const queryClient = useQueryClient();
    const {user} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);
    const editable = report.owner === Number(user.id);

    function generateMenu() {
        const buttons = [];
        buttons.push(<Owner key="report-owner" reportId={reportId}/>);

        if (!editable) {
            buttons.push(<TakeOwnership key="report-takeowner" reportId={reportId}/>);
        }

        buttons.push(<DuplicateReport key="report-duplicate" reportId={reportId}/>);

        if (editable) {
            buttons.push(<DeleteReport key="delete-report" reportId={reportId}/>);
        }
        return buttons
    }

    return <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
        <Text type={Text.types.TEXT1}>
            {report.name || "New report"}
        </Text>
        <Flex gap={Flex.gaps.XS}>
            {generateMenu()}
        </Flex>
    </Flex>
}