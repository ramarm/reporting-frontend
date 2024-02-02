import {useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {Button, Collapse, Divider, Space, theme, Typography} from "antd";
import ReportExtra from "./ReportExtra.jsx";
import Report from "./Report.jsx";

const {Text} = Typography;
const REPORTS = [
    {
        id: 0,
        title: "Report 1",
        owner: "Ram Perel Perel perel perel",
        from: null,
        to: null,
        subject: "Testing report",
        body: "This is the content of a test report",
    },
    {
        id: 1,
        title: "Report 2",
        owner: "Ram Perel",
        from: null,
        to: null,
        subject: "I am a little bit longer subject",
        body: "I am a very very long content and I am going to be longer with new lines and more.\nNow I am in a new line even",
    }
]

export default function ReportsView() {
    const {token} = theme.useToken();
    const [reports, setReports] = useState(REPORTS);
    const [activeKey, setActiveKey] = useState([]);

    function updateReport(reportId, key, value) {
        const report = reports.find((report) => report.id === reportId);
        report[key] = value;
        setReports([...reports]);
    }

    function createReport() {
        const key = reports.length;
        setReports((prevState) => [...prevState, {
            title: `Report ${key + 1}`,
            owner: "Ram Perel",
            content: `The content of return ${key + 1}`
        }]);
        setActiveKey((prevState) => [...prevState, key]);
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
                extra: <ReportExtra owner={report.owner}/>
            }
        })
    }

    if (reports === null) {
        return <Loader/>
    }

    if (reports.length === 0) {
        return <div style={{
            textAlign: "center"
        }}>
            <h1>You don&apos;t have any reports</h1>
            <Button type="primary"
                    onClick={createReport}>Create new report</Button>
        </div>
    }
    console.log(token.colorBgContainer)
    return (
        <div style={{
            margin: "0 20px"
        }}>
            <Button type="primary"
                    style={{
                        float: "right"
                    }}
                    onClick={createReport}>Create new report</Button>
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