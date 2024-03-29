import {Flex, Text, Button} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {STORAGE_SUBSCRIPTION_KEY} from "../../../consts.js";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export default function PricingAndPlans() {
    const subscription = JSON.parse(sessionStorage.getItem(STORAGE_SUBSCRIPTION_KEY));
    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}>
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
            <Heading type={Heading.types.H1}>You currently own the {subscription.name} plan.</Heading>
            <Heading type={Heading.types.H2}>This plan
                includes {subscription.configuration.monthlyIntegrationLimit} insights per month</Heading>
        </Flex>
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
            <Heading type={Heading.types.H1}>Need to change your plan?</Heading>
            <Text type={Text.types.TEXT1}>Insights application has several packages. Payment is available via monday.com
                platform.</Text>
            <Text type={Text.types.TEXT1}>Find below two options to pay, via the marketplace and via the SuperForm
                application view itself. It is possible to pay by credit card or with PayPal.</Text>
            <Button size={Button.sizes.LARGE}
                    onClick={() => monday.execute('openPlanSelection')}>Click here to change your plan</Button>
        </Flex>
    </Flex>
        ;
}