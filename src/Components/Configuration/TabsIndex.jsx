import {useState} from "react";
import {BarChartOutlined, DollarOutlined, FormOutlined, QuestionOutlined} from "@ant-design/icons";
import {Space, Tabs} from "antd";
import ReportsView from "./Reports/ReportsView.jsx";

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
        }
    ]

    return <Tabs type="card"
                 activeKey={selected}
                 onChange={setSelected}
                 items={tabs}/>
}