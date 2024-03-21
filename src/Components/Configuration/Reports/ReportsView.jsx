import {useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {Collapse, Divider, Space, Typography} from "antd";
import ReportExtra from "./ReportExtra.jsx";
import Report from "./Report.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {createReport, getReports} from "../../../Queries/reporting.js";
import {convert as htmlConvert} from "html-to-text";
import {Flex, Button, Modal, ModalHeader, ModalContent} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";

const {Text} = Typography;

export default function ReportsView() {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [activeKey, setActiveKey] = useState([]);
    const [activeReport, setActiveReport] = useState();

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
        setActiveKey((prevState) => [...prevState, newReport.id]);
    }

    function generateCollapseItems() {
        return reports.map((report) => {
            return {
                key: report.id,
                label: <Space split={<Divider type="vertical" style={{margin: 0}}/>}>
                    <Text ellipsis={true}
                          style={{
                              width: "150px",
                              fontWeight: 600
                          }}>{report.subject ? report.subject : "No subject"}</Text>
                    <Text ellipsis={true}
                          style={{maxWidth: "50vw"}}>{report.body ? htmlConvert(report.body, {
                        selectors: [
                            {selector: "img", format: "skip"}
                        ]
                    }) : "No body"}</Text>
                </Space>,
                children: <Report reportId={report.id}/>,
                extra: <ReportExtra reportId={report.id}/>
            }
        });
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
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} style={{width: "100%"}}>
            {reports.map((report, index) => {
                return <Button key={index} kind={Button.kinds.SECONDARY} style={{width: "100%"}}
                               onClick={() => setActiveReport(report.id)}>
                    {report.subject || "new"}
                </Button>
            })}
        </Flex>
        {activeReport && <Modal show={activeReport}
                                classNames={{modal: 'report-modal'}}
               onClose={() => setActiveReport(undefined)}>
            <ModalHeader title="Report"/>
            <ModalContent>
                <Report reportId={activeReport}/>
            </ModalContent>
        </Modal>}
    </Flex>
}