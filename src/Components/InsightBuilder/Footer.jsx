import {Flex, Button} from "monday-ui-react-core";
import {NavigationChevronLeft, NavigationChevronRight, LearnMore, Broom} from "monday-ui-react-core/icons";

export default function Footer({insightData}) {
    return <Flex className="insight-builder-footer"
                 justify={Flex.justify.SPACE_BETWEEN}>
        <Button kind={Button.kinds.SECONDARY}
                leftIcon={NavigationChevronLeft}>
            Back
        </Button>
        <div className="horizontal-space">
            <Button kind={Button.kinds.SECONDARY}
                    leftIcon={LearnMore}>
                Help
            </Button>
            <Button kind={Button.kinds.SECONDARY}
                    leftIcon={Broom}>Clear all</Button>
            <Button kind={Button.kinds.PRIMARY}
            rightIcon={NavigationChevronRight}>
                Next
            </Button>
        </div>
    </Flex>
}