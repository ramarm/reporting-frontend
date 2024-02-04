import {Button, Divider, Input, Space} from "antd";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchReport} from "../../../Queries/reporting.js";
import From from "./From.jsx";

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

    function recipientAddon() {
        return <Space size={5}>
            {!report.cc && <Button size="small" type="text" onClick={() => updateReport("cc", [])}>Cc</Button>}
            {!report.bcc && <Button size="small" type="text" onClick={() => updateReport("bcc", [])}>Bcc</Button>}
        </Space>
    }

    function setReportSubject(subject) {
        setReport("subject", subject);
    }

    function updateReportSubject(subject) {
        updateReport("subject", subject);
    }

    function setReportBody(body) {
        updateReport("body", body);
    }

    return <Space direction="vertical"
                  size={5}
                  split={<Divider style={{margin: 0}}/>}
                  style={{width: "100%"}}>
        <Space direction="vertical"
               size={5}
               split={<Divider style={{margin: 0}}/>}
               style={{width: "100%"}}>
            <From reportId={reportId} setReport={setReport}/>
            <Input prefix="To" variant="borderless" addonAfter={recipientAddon()}/>
            {report.cc && <Input prefix="Cc" variant="borderless"/>}
            {report.bcc && <Input prefix="Bcc" variant="borderless"/>}
        </Space>
        <Input placeholder="Subject" variant="borderless" value={report.subject}
               onChange={(e) => updateReportSubject(e.target.value)}
               onBlur={(e) => setReportSubject(e.target.value)}/>
        <Input.TextArea rows={5} variant="borderless" value={report.body}
                        onChange={(e) => setReportBody(e.target.value)}/>
    </Space>
}