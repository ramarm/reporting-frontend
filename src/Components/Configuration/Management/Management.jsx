import {Flex} from "monday-ui-react-core";
import Card from "./Card.jsx";
import CardGroup from "./CardGroup.jsx";
import "./Management.css";
import {STORAGE_SUBSCRIPTION_KEY} from "../../../consts.js";
import {getSubscriptionDate} from "../../../Queries/management.js";
import {useQuery} from "@tanstack/react-query";
import {getInsightsUsage} from "../../../Queries/reporting.js";

export default function Management() {
    const subscription = JSON.parse(sessionStorage.getItem(STORAGE_SUBSCRIPTION_KEY));

    const {
        data: subscriptionDate,
        isLoading: isLoadingSubscriptionDate
    } = useQuery({
        queryKey: ["subscription_date"],
        queryFn: getSubscriptionDate
    });

    const {
        data: accountInsightsUsage,
        isLoading: isLoadingAccountInsightsUsage
    } = useQuery({
        queryKey: ["account_usage"],
        queryFn: () => getInsightsUsage({since: subscriptionDate}),
        enabled: !!subscriptionDate
    });

    const limit = subscription?.configuration?.monthlyIntegrationLimit;

    return <Flex className="management-tab" direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}
                 style={{width: "100%"}}>
        <CardGroup title="Usage" cards={[
            <Card key="integration-insights-count" title="Integration Insights"
                  description={subscription?.is_default ? "last 30 days" : `since ${subscriptionDate.format("DD MMM, YYYY")}`}
                  value={accountInsightsUsage?.integration}
                  isLoading={isLoadingAccountInsightsUsage}/>,
            <Card key="report-insights-count" title="Email Insights"
                  description={subscription?.is_default ? "last 30 days" : `since ${subscriptionDate.format("DD MMM, YYYY")}`}
                  value={accountInsightsUsage?.report}
                  isLoading={isLoadingAccountInsightsUsage}/>,
            <Card key="account-insights-count" title="Total Insights"
                  description={subscription?.is_default ? "last 30 days" : `since ${subscriptionDate.format("DD MMM, YYYY")}`}
                  value={`${accountInsightsUsage?.total}/${limit}`}
                  prefix={`${Math.round((accountInsightsUsage?.total / limit) * 100)}%`}
                  isLoading={isLoadingAccountInsightsUsage || isLoadingSubscriptionDate}/>,
            <Card key="renew-date" title="Renew date"
                  value={subscription?.is_default ? "Free plan" : subscriptionDate.add(1, "M").format("DD MMM, YYYY")}
                  isLoading={isLoadingSubscriptionDate}/>
        ]}/>
    </Flex>;
}