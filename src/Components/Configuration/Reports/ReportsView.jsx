import {useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {Button, Collapse, Divider, Space, Typography} from "antd";
import ReportExtra from "./ReportExtra.jsx";
import Report from "./Report.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {createReport, getReports} from "../../../Queries/reporting.js";

const {Text} = Typography;

export default function ReportsView() {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [activeKey, setActiveKey] = useState([]);

    const {data: reports, isLoading: isLoadingReports} = useQuery({
        enabled: !!context.boardId,
        queryKey: ["reports"],
        queryFn: () => getReports({boardId: context.boardId}),
        onError: (error) => {
            console.error("error -", error);
        }
    });

    function updateReport(reportId, key, value) {
        queryClient.setQueryData(["reports"], (oldData) => {
            const report = oldData.find((report) => report.id === reportId);
            report[key] = value;
            return [...oldData];
        });
    }

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
        return reports.map((report, index) => {
            return {
                key: index,
                label: <Space split={<Divider type="vertical" style={{margin: 0}}/>}>
                    <Text ellipsis={true}
                          style={{
                              width: "150px",
                              fontWeight: 600
                          }}>{report.subject ? report.subject : "No subject"}</Text>
                    <Text ellipsis={true}
                          style={{maxWidth: "50vw"}}>{report.body ? report.body : "No body"}</Text>
                </Space>,
                children: <Report report={report} updateReport={(key, value) => updateReport(report.id, key, value)}/>,
                extra: <ReportExtra report={report}/>
            }
        })
    }

    if (reports === undefined || reports === null || isLoadingReports) {
        return <Loader/>
    }

    if (reports.length === 0) {
        return <div style={{
            textAlign: "center"
        }}>
            <h1>You don&apos;t have any reports</h1>
            <Button type="primary"
                    onClick={createNewReport}>Create new report</Button>
        </div>
    }

    return (
        <div style={{
            margin: "0 20px"
        }}>
            <Button type="primary"
                    style={{
                        float: "right"
                    }}
                    onClick={createNewReport}>Create new report</Button>
            <h1>Your reports</h1>
            <Collapse items={generateCollapseItems()}
                      activeKey={activeKey}
                      bordered={false}
                      onChange={(newActiveKeys) => {
                          setActiveKey(newActiveKeys);
                      }}/>
        </div>
    )
}