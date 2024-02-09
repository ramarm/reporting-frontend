import {Alert, Modal, Space} from "antd";
import MicrosoftAuth from "./Microsoft.jsx";
import GoogleAuth from "./Google.jsx";
import {useState} from "react";

export default function AuthModal({isOpen, closeModal, refetchAccount, setSender}) {
    const [clicked, setClicked] = useState(false);

    return <Modal open={isOpen}
                  footer={null}
                  onCancel={closeModal}
                  closable={true}
                  zIndex={99999}>
        <Space direction="vertical" style={{textAlign: "center", width: "100%"}}>
            <GoogleAuth refetchAccounts={refetchAccount} setSender={setSender} closeModal={() => {
                setClicked(true);
                closeModal();
            }}/>
            <MicrosoftAuth refetchAccounts={refetchAccount} setSender={setSender} closeModal={() => {
                setClicked(true);
                closeModal();
            }}/>
            <Alert message="Make sure to tick all the checkboxes when authorizing your account"/>
            {clicked && <Alert type="error"
                               message="If you are using the monday.com Desktop app those buttons will not work. Please use the web version of monday.com to authorize your account."/>}
        </Space>
    </Modal>
}