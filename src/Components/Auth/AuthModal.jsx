import MicrosoftAuth from "./Microsoft.jsx";
import GoogleAuth from "./Google.jsx";
import {useState} from "react";
import {Flex, Modal, ModalContent, ModalHeader, AttentionBox} from "monday-ui-react-core";
import {Info} from "monday-ui-react-core/icons";

export default function AuthModal({isOpen, closeModal, setSender}) {
    const [clicked, setClicked] = useState(false);

    return <Modal id="add-account-modal"
                  classNames={{container: "add-account-modal-container"}}
                  show={isOpen}
                  onClose={closeModal}>
        <ModalHeader title={""}/>
        <ModalContent>
            <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
                {clicked && <AttentionBox type={AttentionBox.types.DANGER}
                                          title="Are you using the Desktop app?"
                                          text="The desktop monday app does not support popups. Please use the web version of monday.com to authorize your account"/>}
                <GoogleAuth setSender={setSender}
                            closeModal={() => {
                                setClicked(true);
                                closeModal();
                            }}/>
                <MicrosoftAuth setSender={setSender}
                               closeModal={() => {
                                   setClicked(true);
                                   closeModal();
                               }}/>
                <AttentionBox icon={Info}
                              text="Make sure to tick all the checkboxes when authorizing your account"/>
            </Flex>
        </ModalContent>
    </Modal>
}