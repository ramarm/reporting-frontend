import {
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    Button,
    Flex,
    MultiStepIndicator,
    Icon
} from 'monday-ui-react-core';
import {useRef, useState} from "react";
import "./InsightBuilder.css";
import "./VibeBugFix.css";
import {FUNCTIONS} from "./insightsFunctions.jsx";
import Steps from "./Modal/Steps.jsx";
import MainContent from "./Modal/MainContent.jsx";
import Footer from "./Modal/Footer.jsx";
import {$createRangeSelection, $getSelection, $insertNodes} from "lexical";
import {getClosestElementNode} from "../Editor/SpotnikEditor/Plugins/KeyboardPlugin.js";
import {$createDivParagraphNode} from "../Editor/SpotnikEditor/Nodes/DivParagraphNode.jsx";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$createInsightNode} from "./InsightNode.jsx";
import {NavigationChevronLeft,NavigationChevronRight, Check} from "monday-ui-react-core/icons";

export default function InsightBuilder() {
    const [editor] = useLexicalComposerContext();
    const [insightData, setInsightData] = useState({filters: []});
    const [isFilterDone, setIsFilterDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    const steps = [
        {
            key: "function",
            titleText: "Function",
            status: functionStepStatus()
        },
        {
            key: "configuration",
            titleText: "Configuration",
            status: configurationStepStatus(),
        },
        {
            key: "filter",
            titleText: "Filter",
            status: filterStepStatus(),
            onNext: () => setIsFilterDone(true),
            nextText: (insightData.filters?.length > 0 || insightData.breakdown) ? "Next" : "Skip",
            isNextDisabled: !verifyFilters(),
            nextIcon: NavigationChevronRight
        },
        {
            key: "preview",
            titleText: "Preview",
            status: previewStepStatus(),
            onBack: () => setIsFilterDone(false),
            backIcon: NavigationChevronLeft,
            onNext: insertInsight,
            nextText: "Confirm",
            nextColor: Button.colors.POSITIVE,
            nextIcon: Check
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

    function insertInsight() {
        editor.update(() => {
            let selection;
            selection = $getSelection();
            if (selection === null) {
                selection = $createRangeSelection();
            }
            const hasElementNode = selection.getNodes().map(getClosestElementNode).some((node) => node);
            const nodesToInsert = [];
            if (!hasElementNode) {
                nodesToInsert.push($createDivParagraphNode());
            }
            nodesToInsert.push($createInsightNode({
                title: "{insight}",
                func: insightData.function.value,
                column: insightData.column,
                value: insightData.value,
                timespan: insightData.timespan,
                filters: insightData.filters,
                breakdown: insightData.breakdown
            }));
            $insertNodes(nodesToInsert);
        })
        closeModal();
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
               classNames={{modal: 'insight-modal'}}
               onClose={closeModal}
               show={isOpen}
               triggerElement={buttonRef.current}>
            <ModalHeader title="" titleClassName="insight-modal-header">
                <Steps steps={steps}/>
            </ModalHeader>
            <ModalContent className="insight-modal-content">
                <MainContent insightData={insightData} setInsight={setInsight} currentStep={currentStep()}/>
            </ModalContent>
            <ModalFooter>
                <Footer step={currentStep()} resetInsight={resetInsight}/>
            </ModalFooter>
        </Modal>
    </div>
}