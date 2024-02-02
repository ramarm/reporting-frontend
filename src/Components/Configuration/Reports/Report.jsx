import {Button, Divider, Input, Space} from "antd";

export default function Report({report, updateReport}) {
    function generateRecipientAddon() {
        if (report.cc && report.bcc) {
            return null;
        }
        return <Space size={5}>
            {!report.cc && <Button size="small" type="text" onClick={() => updateReport("cc", [])}>Cc</Button>}
            {!report.bcc && <Button size="small" type="text" onClick={() => updateReport("bcc", [])}>Bcc</Button>}
        </Space>
    }

    function setReportSubject(subject) {
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
            <Input prefix="From" variant="borderless"/>
            <Input prefix="To" addonAfter={generateRecipientAddon()} variant="borderless"/>
            {report.cc && <Input prefix="Cc" variant="borderless"/>}
            {report.bcc && <Input prefix="Bcc" variant="borderless"/>}
        </Space>
        <Input placeholder="Subject" variant="borderless" value={report.subject}
               onChange={(e) => setReportSubject(e.target.value)}/>
        <Input.TextArea rows={5} variant="borderless" value={report.body}
                        onChange={(e) => setReportBody(e.target.value)}/>
    </Space>
}