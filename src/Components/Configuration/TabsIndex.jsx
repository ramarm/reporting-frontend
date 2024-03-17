import {useState} from "react";
import ReportsView from "./Reports/ReportsView.jsx";
import {Tab, TabList, TabPanel, TabPanels, TabsContext} from "monday-ui-react-core";
import {Dashboard, Edit, Help, Upgrade} from "monday-ui-react-core/icons";


export default function TabsIndex() {
    const [activeTab, setActiveTab] = useState(0);

    return <TabsContext activeTabId={activeTab}>
        <TabList className="insights-tab-list" onTabChange={setActiveTab}>
            <Tab icon={Edit}>Reports</Tab>
            <Tab icon={Help}>How to use</Tab>
            <Tab icon={Dashboard}>Management</Tab>
            <Tab icon={Upgrade}>Pricing & Plans</Tab>
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