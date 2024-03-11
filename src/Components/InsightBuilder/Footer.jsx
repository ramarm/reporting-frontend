import {Flex, Button} from "monday-ui-react-core";
import {NavigationChevronLeft, NavigationChevronRight, LearnMore, Broom} from "monday-ui-react-core/icons";

export default function Footer({step, resetInsight}) {
    return <Flex className="insight-builder-footer"
                 justify={Flex.justify.SPACE_BETWEEN}>
        <Button kind={Button.kinds.SECONDARY}
                leftIcon={NavigationChevronLeft}
                onClick={step.onBack}>
            Back
        </Button>
        <div className="horizontal-space">
            <Button kind={Button.kinds.SECONDARY}
                    leftIcon={LearnMore}>
                Help
            </Button>
            <Button kind={Button.kinds.SECONDARY}
                    leftIcon={Broom}
                    onClick={resetInsight}>Clear all</Button>
            <Button disabled={step.isNextDisabled}
                    kind={Button.kinds.PRIMARY}
                    rightIcon={NavigationChevronRight}
                    onClick={step.onNext}>
                {step.nextText || "Next"}
            </Button>
        </div>
    </Flex>
}