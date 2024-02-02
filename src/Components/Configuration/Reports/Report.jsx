import {Button, Divider, Input, Space} from "antd";
import {useState} from "react";
import AuthModal from "../../Auth/AuthModal.jsx";

export default function Report({report, updateReport}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function addAccountAddon() {
        return <Button size="small" type="text" onClick={() => setIsModalOpen(true)}>Add account</Button>
    }

    function recipientAddon() {
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

    return <>
        <Space direction="vertical"
               size={5}
               split={<Divider style={{margin: 0}}/>}
               style={{width: "100%"}}>
            <Space direction="vertical"
                   size={5}
                   split={<Divider style={{margin: 0}}/>}
                   style={{width: "100%"}}>
                <Input prefix="From" variant="borderless" addonAfter={addAccountAddon()}/>
                <Input prefix="To" variant="borderless" addonAfter={recipientAddon()}/>
                {report.cc && <Input prefix="Cc" variant="borderless"/>}
                {report.bcc && <Input prefix="Bcc" variant="borderless"/>}
            </Space>
            <Input placeholder="Subject" variant="borderless" value={report.subject}
                   onChange={(e) => setReportSubject(e.target.value)}/>
            <Input.TextArea rows={5} variant="borderless" value={report.body}
                            onChange={(e) => setReportBody(e.target.value)}/>
        </Space>
        <AuthModal isOpen={isModalOpen}
                   closeModal={() => setIsModalOpen(false)}/>
    </>
}