import {Flex, Button} from "monday-ui-react-core";
import {LearnMore, Broom} from "monday-ui-react-core/icons";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();


export default function Footer({step, resetInsight}) {
    return <Flex className="insight-builder-footer"
                 justify={Flex.justify.SPACE_BETWEEN}>
        <Flex gap={Flex.gaps.SMALL}>
            <Button kind={Button.kinds.SECONDARY}
                    onClick={() => {
                        monday.execute("openAppFeatureModal", {
                            url: "https://www.spot-nik.com/how-to-use-insights",
                            height: "750px",
                            width: "750px"
                        })
                    }}
                    leftIcon={LearnMore}>
                Help
            </Button>
            <Button kind={Button.kinds.SECONDARY}
                    leftIcon={Broom}
                    onClick={resetInsight}>Clear all</Button>
        </Flex>
        <Flex gap={Flex.gaps.SMALL}>
            {step.onBack && <Button kind={Button.kinds.SECONDARY}
                                    leftIcon={step.backIcon}
                                    onClick={step.onBack}>
                Back
            </Button>}
            {step.onNext && <Button disabled={step.isNextDisabled}
                                    kind={Button.kinds.PRIMARY}
                                    color={step.nextColor}
                                    rightIcon={step.nextIcon}
                                    onClick={step.onNext}>
                {step.nextText || "Next"}
            </Button>}
        </Flex>
    </Flex>
}