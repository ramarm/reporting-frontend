import {useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {createReport, getReports} from "../../../Queries/reporting.js";
import {Divider, Flex, Button, List, ListItem} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import "./Report.css";
import Report from "./Report.jsx";

export default function ReportsView() {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [activeReportId, setActiveReportId] = useState();

    const {data: reports, isLoading: isLoadingReports} = useQuery({
        enabled: !!context.boardId,
        queryKey: ["reports"],
        queryFn: () => getReports({boardId: context.boardId}),
        onError: (error) => {
            console.error("error -", error);
        }
    });

    async function createNewReport() {
        const newReport = await createReport({boardId: context.boardId});
        queryClient.setQueryData(["reports"], (oldData) => {
            return [
                ...oldData,
                newReport
            ];
        });
        setActiveReportId(newReport.id);
    }

    if (reports === undefined || reports === null || isLoadingReports) {
        return <Loader/>
    }

    if (reports.length === 0) {
        return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}>
            <Heading type={Heading.types.H1}>You don&apos;t have any reports</Heading>
            <Button type="primary"
                    onClick={createNewReport}>Create new report</Button>
        </Flex>
    }

    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE} style={{padding: "0 20px", width: "auto"}}>
        <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
            <Heading type={Heading.types.H1}>Your reports</Heading>
            <Button type="primary"
                    onClick={createNewReport}>Create new report</Button>
        </Flex>
        <List id="report-list" component={List.components.DIV}>
            {reports.map((report, index) => {
                return [index !== 0 && <Divider key={`${report.id}-divider`} className="report-list-divider"/>,
                    <ListItem key={report.id}
                              className="report-list-item"
                              onClick={() => setActiveReportId(report.id)}>
                        <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
                            <Heading type={Heading.types.H2}
                                     weight={Heading.weights.LIGHT}>
                                {report.name || "New report"}
                            </Heading>
                            <span>owner</span>
                        </Flex>
                    </ListItem>
                ]
            })}
        </List>
        {activeReportId && <Report reportId={activeReportId} setReportId={setActiveReportId}/>}
    </Flex>
}