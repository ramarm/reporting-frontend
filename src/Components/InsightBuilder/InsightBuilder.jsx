import {Modal, ModalHeader, ModalContent, Button, Flex} from 'monday-ui-react-core';
import {useRef, useState} from "react";
import "./InsightBuilder.css";
import "./VibeBugFix.css";
import Steps from "./Steps.jsx";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";
import {FUNCTIONS} from "./insightsFunctions.js";

export default function InsightBuilder() {
    const [insightData, setInsightData] = useState({});
    const [isOpen, setIsOpen] = useState(true);
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
            status: isFilterStepDone() ? "fulfilled" : "pending",
            isNextDisabled: false
        },
        {
            key: "breakdown",
            titleText: "Breakdown",
            status: isBreakdownStepDone() ? "fulfilled" : "pending",
            isNextDisabled: false
        },
        {
            key: "preview",
            titleText: "Preview"
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

    function isFilterStepDone() {
        return insightData.filter !== undefined;
    }

    function isBreakdownStepDone() {
        return insightData.breakdown !== undefined;
    }

    function currentStep() {
        return steps.find((step) => step.status === "pending");
    }

    function resetInsight() {
        setInsightData({});
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

    console.log(insightData);

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
                    <MainContent insightData={insightData} setInsight={setInsight}/>
                    <Footer step={currentStep()} resetInsight={resetInsight}/>
                </Flex>
            </ModalContent>
        </Modal>
    </div>
}