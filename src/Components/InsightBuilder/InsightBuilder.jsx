import {Modal, ModalHeader, ModalContent, Button, Flex} from 'monday-ui-react-core';
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
    const [isBreakdownDone, setIsBreakdownDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    const steps = [
        {
            key: "function",
            titleText: "Function",
            status: isFunctionStepDone() ? "fulfilled" : "pending",
            isNextDisabled: true
        },
        {
            key: "configuration",
            titleText: "Configuration",
            status: isConfigurationStepDone() ? "fulfilled" : "pending",
            isNextDisabled: true
        },
        {
            key: "filter",
            titleText: "Filter",
            status: isFilterDone ? "fulfilled" : "pending",
            nextText: insightData.filters?.length > 0 ? "Next" : "Skip",
            isNextDisabled: !verifyFilters(),
            onNext: () => setIsFilterDone(true)
        },
        {
            key: "breakdown",
            titleText: "Breakdown",
            status: isBreakdownDone ? "fulfilled" : "pending",
            nextText: insightData.breakdown ? "Done" : "Skip",
            isNextDisabled: false,
            onNext: () => setIsBreakdownDone(true),
            onBack: () => setIsFilterDone(false)
        },
        {
            key: "preview",
            titleText: "Preview",
            status: "pending",
            onBack: () => setIsBreakdownDone(false)
        }
    ]

    function isFunctionStepDone() {
        return insightData.function !== undefined;
    }

    function isConfigurationStepDone() {
        if (chosenFunction) {
            return chosenFunction.configurationFields.every((field) => insightData[field] !== undefined);
        }
    }

    function verifyFilters() {
        if (insightData.filters.length === 0) {
            return true;
        }
        return insightData.filters.every((filter) => filter.column && filter.condition && filter.value);

    }

    function currentStep() {
        return steps.find((step) => step.status === "pending");
    }

    function resetInsight() {
        setInsightData({filters: []});
        setIsFilterDone(false);
        setIsBreakdownDone(false);
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
        <Button ref={buttonRef} onClick={() => setIsOpen(true)}>Create Insight</Button>
        <Modal id="add-insight-modal"
               width={Modal.width.FULL_WIDTH}
               onClose={closeModal}
               show={isOpen}
               triggerElement={buttonRef.current}>
            <ModalHeader title="" titleClassName="insight-modal-header"/>
            <ModalContent>
                <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.MEDIUM}>
                    <Steps steps={steps} insightData={insightData}/>
                    <MainContent insightData={insightData} setInsight={setInsight} currentStep={currentStep()}/>
                    <Footer step={currentStep()} resetInsight={resetInsight}/>
                </Flex>
            </ModalContent>
        </Modal>
    </div>
}