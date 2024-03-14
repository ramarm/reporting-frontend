import {Modal, ModalHeader, ModalContent, Button, Flex, MultiStepIndicator, Icon} from 'monday-ui-react-core';
import {useRef, useState} from "react";
import "./InsightBuilder.css";
import "./VibeBugFix.css";
import Steps from "./Steps.jsx";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";
import {FUNCTIONS} from "./insightsFunctions.js";

export default function InsightBuilder() {
    const [insightData, setInsightData] = useState({filters: []});
    const [isFilterDone, setIsFilterDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    const steps = [
        {
            key: "function",
            titleText: "Function",
            status: functionStepStatus(),
            isNextDisabled: true
        },
        {
            key: "configuration",
            titleText: "Configuration",
            status: configurationStepStatus(),
            isNextDisabled: true
        },
        {
            key: "filter",
            titleText: "Filter",
            status: filterStepStatus(),
            nextText: insightData.filters?.length > 0 ? "Next" : "Skip",
            isNextDisabled: !verifyFilters(),
            onNext: () => setIsFilterDone(true)
        },
        {
            key: "preview",
            titleText: "Preview",
            status: previewStepStatus(),
            onBack: () => setIsFilterDone(false)
        }
    ].filter((step) => step.key !== "filter" || (step.key === "filter" && functionHasFilterStep()))

    function currentStep() {
        return steps.find((step) => step.status === MultiStepIndicator.stepStatuses.ACTIVE);
    }

    function functionStepStatus() {
        if (insightData.function) {
            return MultiStepIndicator.stepStatuses.FULFILLED;
        }
        return MultiStepIndicator.stepStatuses.ACTIVE;
    }

    function configurationStepStatus() {
        if (chosenFunction) {
            if (chosenFunction.configurationFields.every((field) => insightData[field] !== undefined)) {
                return MultiStepIndicator.stepStatuses.FULFILLED;
            }
            return MultiStepIndicator.stepStatuses.ACTIVE;
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function functionHasFilterStep() {
        return chosenFunction?.supportsFilter || chosenFunction?.supportsBreakdown;
    }

    function filterStepStatus() {
        if (configurationStepStatus() === MultiStepIndicator.stepStatuses.FULFILLED) {
            if (functionHasFilterStep()) {
                if (isFilterDone) {
                    return MultiStepIndicator.stepStatuses.FULFILLED;
                }
                return MultiStepIndicator.stepStatuses.ACTIVE;
            }
            return MultiStepIndicator.stepStatuses.FULFILLED
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function previewStepStatus() {
        if (filterStepStatus() === MultiStepIndicator.stepStatuses.FULFILLED) {
            return MultiStepIndicator.stepStatuses.ACTIVE;
        }
        return MultiStepIndicator.stepStatuses.PENDING;
    }

    function verifyFilters() {
        if (insightData.filters.length === 0) {
            return true;
        }
        return insightData.filters.every((filter) => filter.column && filter.condition && filter.value);
    }

    function resetInsight() {
        setInsightData({filters: []});
        setIsFilterDone(false);
    }

    function setInsight(key, value) {
        if (key === "function") {
            resetInsight();
        }
        setInsightData({...insightData, [key]: value});
    }

    function closeModal() {
        setIsOpen(false);
        resetInsight();
    }

    return <div>
        <Button id="add-insight-button"
                ref={buttonRef}
                size={Button.sizes.SMALL}
                onClick={() => setIsOpen(true)}>
            <Flex gap={Flex.gaps.SMALL}>
                <Icon iconType={Icon.type.SRC}
                      icon="insights-transparent.svg"/>
                <span>Create Insight</span>
            </Flex>
        </Button>
        <Modal id="add-insight-modal"
               width={Modal.width.FULL_WIDTH}
               onClose={closeModal}
               show={isOpen}
               triggerElement={buttonRef.current}>
            <ModalHeader title="" titleClassName="insight-modal-header"/>
            <ModalContent>
                <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.MEDIUM}>
                    <Steps steps={steps}/>
                    <MainContent insightData={insightData} setInsight={setInsight} currentStep={currentStep()}/>
                    <Footer step={currentStep()} resetInsight={resetInsight}/>
                </Flex>
            </ModalContent>
        </Modal>
    </div>
}