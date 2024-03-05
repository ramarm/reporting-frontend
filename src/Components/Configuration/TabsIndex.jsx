import {useState} from "react";
import ReportsView from "./Reports/ReportsView.jsx";
import {Tab, TabList, TabPanel, TabPanels, TabsContext} from "monday-ui-react-core";
import {Dashboard, Edit, Help, Upgrade} from "monday-ui-react-core/icons";


export default function TabsIndex() {
    const [activeTab, setActiveTab] = useState(0);

    return <TabsContext activeTabId={activeTab}>
        <TabList className="insights-tab-list" onTabChange={setActiveTab}>
            <Tab icon={Edit} className="reporting-tab">Reports</Tab>
            <Tab icon={Help} className="reporting-tab">How to use</Tab>
            <Tab icon={Dashboard} className="reporting-tab">Management</Tab>
            <Tab icon={Upgrade} className="reporting-tab">Pricing & Plans</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <ReportsView/>
            </TabPanel>
            <TabPanel>
                <h1>How to use</h1>
            </TabPanel>
            <TabPanel>
                <h1>Management</h1>
            </TabPanel>
            <TabPanel>
                <h1>Pricing & Plans</h1>
            </TabPanel>
        </TabPanels>
    </TabsContext>
}