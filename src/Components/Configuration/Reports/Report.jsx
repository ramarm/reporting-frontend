import {Divider, Input, Space} from "antd";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchReport} from "../../../Queries/reporting.js";
import From from "./From.jsx";
import Recipients from "./Recipients.jsx";

export default function Report({reportId}) {
    const queryClient = useQueryClient();
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    const {mutate: patchReportMutation} = useMutation({
        mutationFn: ({reportId, key, value}) => patchReport({reportId, key, value}),
        onSuccess: ({key, value}) => {
            updateReport(key, value);
        }
    })

    function setReport(key, value) {
        patchReportMutation({reportId, key, value});
    }

    function updateReport(key, value) {
        queryClient.setQueryData(["reports"], (oldData) => {
            const newData = [...oldData];
            const reportIndex = newData.findIndex((report) => report.id === reportId);
            const newReport = {...newData[reportIndex]};
            newReport[key] = value;
            newData[reportIndex] = newReport;
            return newData;
        });
    }

    function setReportSubject(subject) {
        setReport("subject", subject);
    }

    return <Space direction="vertical"
                  size={2}
                  split={<Divider style={{margin: 0}}/>}
                  style={{width: "100%", lineHeight: "32px"}}>
        <Space direction="vertical"
               size={2}
               split={<Divider style={{margin: 0}}/>}
               style={{width: "100%"}}>
            <From reportId={reportId} setReport={setReport}/>
            <Recipients reportId={reportId} setReport={setReport}/>
        </Space>
        <Input style={{lineHeight: "32px"}}
               placeholder="Subject"
               variant="borderless"
               value={report.subject}
               onChange={(e) => updateReport("subject", e.target.value)}
               onBlur={(e) => setReportSubject(e.target.value)}/>
        <Input.TextArea rows={5}
                        variant="borderless"
                        value={report.body}
                        onChange={(e) => updateReport("body", e.target.value)}
                        onBlur={(e) => setReport("body", e.target.value)}/>
    </Space>
}