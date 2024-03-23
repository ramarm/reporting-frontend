import {useState} from "react";
import ReportsView from "./Reports/ReportsView.jsx";
import {Tab, TabList, TabPanel, TabPanels, TabsContext, Text, Flex, Icon} from "monday-ui-react-core";
import {Dashboard, Edit, Help, Upgrade} from "monday-ui-react-core/icons";


export default function TabsIndex() {
    const [activeTab, setActiveTab] = useState(0);

    function tabHeader(icon, text) {
        return <Flex gap={Flex.gaps.SMALL}>
            <Icon icon={icon}/>
            <Text type={Text.types.TEXT1}>{text}</Text>
        </Flex>
    }

    return <TabsContext activeTabId={activeTab}>
        <TabList className="insights-tab-list" onTabChange={setActiveTab}>
            <Tab>{tabHeader(Edit, "Reports")}</Tab>
            <Tab>{tabHeader(Help, "How to use")}</Tab>
            <Tab>{tabHeader(Dashboard, "Management")}</Tab>
            <Tab>{tabHeader(Upgrade, "Pricing & Plans")}</Tab>
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