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
            {!report.cc && <Button size="small" type="text" onClick={() => setReport("cc", [])}>Cc</Button>}
            {!report.bcc && <Button size="small" type="text" onClick={() => setReport("bcc", [])}>Bcc</Button>}
        </Space>
    }

    function setReportSubject(subject) {
        setReport("subject", subject);
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
            <Input prefix="To"
                   variant="borderless"
                   value={report.to && report.to[0]}
                   addonAfter={recipientAddon()}
                   onChange={(e) => updateReport("to", [e.target.value])}
                   onBlur={(e) => setReport("to", [e.target.value])}
            />
            {report.cc && <Input
                prefix="Cc"
                variant="borderless"
                value={report.cc && report.cc[0]}
                onChange={(e) => updateReport("cc", [e.target.value])}
                onBlur={(e) => setReport("cc", [e.target.value])}/>}
            {report.bcc && <Input prefix="Bcc"
                                  variant="borderless"
                                  value={report.bcc && report.bcc[0]}
                                  onChange={(e) => updateReport("bcc", [e.target.value])}
                                  onBlur={(e) => setReport("bcc", [e.target.value])}/>}
        </Space>
        <Input placeholder="Subject"
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