import {Modal, ModalHeader, ModalContent, Button, Flex} from 'monday-ui-react-core';
import {useRef, useState} from "react";
import ModalBase from "./ModalBase.jsx";
import "./InsightBuilder.css";
import "./VibeBugFix.css";
import Steps from "./Steps.jsx";
import MainContent from "./MainContent.jsx";
import Footer from "./Footer.jsx";

export default function InsightBuilder() {
    const [insightData, setInsightData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    function closeModal() {
        setIsOpen(false);
        setInsightData({});
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
                    <Steps insightData={insightData}/>
                    <MainContent insightData={insightData}/>
                    <Footer insightData={insightData}/>
                </Flex>
            </ModalContent>
        </Modal>
    </div>
}