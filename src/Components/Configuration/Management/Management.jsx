import {Flex} from "monday-ui-react-core";
import Card from "./Card.jsx";
import CardGroup from "./CardGroup.jsx";
import "./Management.css";
import {STORAGE_MONDAY_CONTEXT_KEY, STORAGE_SUBSCRIPTION_KEY} from "../../../consts.js";
import {getSubscriptionDate} from "../../../Queries/management.js";
import {useQuery} from "@tanstack/react-query";
import {getAccountInsights, getBoardInsights} from "../../../Queries/reporting.js";

export default function Management() {
    const subscription = JSON.parse(sessionStorage.getItem(STORAGE_SUBSCRIPTION_KEY));
    const {boardId} = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {
        data: subscriptionDate,
        isLoading: isLoadingSubscriptionDate
    } = useQuery({
        queryKey: ["subscription_date"],
        queryFn: getSubscriptionDate
    });

    const {
        data: accountInsightsCount,
        isLoading: isLoadingAccountInsightsCount
    } = useQuery({
        queryKey: ["account_usage"],
        queryFn: () => getAccountInsights({since: subscriptionDate}),
        enabled: !!subscriptionDate
    });

    const {
        data: boardInsightsCount,
        isLoading: isLoadingBoardInsightsCount
    } = useQuery({
        queryKey: ["board_usage"],
        queryFn: () => getBoardInsights({boardId, since: subscriptionDate}),
        enabled: !!subscriptionDate
    });

    const limit = subscription?.configuration?.monthlyIntegrationLimit;

    return <Flex className="management-tab" direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}
                 style={{width: "100%"}}>
        <CardGroup title="Usage" cards={[
            <Card key="board-insights-count" title="Board Insights"
                  description={subscription?.is_default ? "last 30 days" : `since ${subscriptionDate.format("DD MMM, YYYY")}`}
                  value={boardInsightsCount}
                  isLoading={isLoadingBoardInsightsCount}/>,
            <Card key="account-insights-count" title="Account Insights"
                  description={subscription?.is_default ? "last 30 days" : `since ${subscriptionDate.format("DD MMM, YYYY")}`}
                  value={`${accountInsightsCount}/${limit}`}
                  prefix={`${Math.round((accountInsightsCount / limit) * 100)}%`}
                  isLoading={isLoadingAccountInsightsCount || isLoadingSubscriptionDate}/>,
            <Card key="renew-date" title="Renew date"
                  value={subscription?.is_default ? "Free plan" : subscriptionDate.add(1, "M").format("DD MMM, YYYY")}
                  isLoading={isLoadingSubscriptionDate}/>
        ]}/>
    </Flex>;
}