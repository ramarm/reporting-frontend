import {useState} from "react";
import {BarChartOutlined, DollarOutlined, FormOutlined, QuestionOutlined} from "@ant-design/icons";
import {Space, Tabs} from "antd";
import ReportsView from "./Reports/ReportsView.jsx";
import {Page, PDFDownloadLink, View, Document, Text, Image} from "@react-pdf/renderer";

function Doc() {
    return <Document>
        <Page size="A4">
            <View>
                <Text>Section #1</Text>
                <Image src="https://media.wired.com/photos/598e35994ab8482c0d6946e0/master/w_1920,c_limit/phonepicutres-TA.jpg"/>
            </View>
        </Page>
    </Document>
}

export default function TabsIndex() {
    const [selected, setSelected] = useState("reports");

    const tabs = [
        {
            label: <Space><FormOutlined/>Reports</Space>,
            key: "reports",
            children: <ReportsView/>
        },
        {
            label: <Space><QuestionOutlined/>How to use</Space>,
            key: "howToUse",
            children: <h1>How to use</h1>
        },
        {
            label: <Space><BarChartOutlined/>Management</Space>,
            key: "management",
            children: <h1>Management</h1>
        },
        {
            label: <Space><DollarOutlined/>Pricing & Plans</Space>,
            key: "pricingAndPlan",
            children: <h1>Pricing & Plans</h1>
        },
        {
            label: <Space><DollarOutlined/>PDF</Space>,
            key: "pdf",
            children: <PDFDownloadLink document={<Doc/>} fileName="somename.pdf">
                {({loading}) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>
        }
    ]

    return <Tabs type="card"
                 activeKey={selected}
                 onChange={setSelected}
                 items={tabs}/>
}