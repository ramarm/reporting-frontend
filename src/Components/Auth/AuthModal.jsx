import {Alert, Modal, Space} from "antd";
import MicrosoftAuth from "./Microsoft.jsx";
import GoogleAuth from "./Google.jsx";

export default function AuthModal({isOpen, closeModal}) {
    return <Modal open={isOpen}
                  footer={null}
                  onCancel={closeModal}
                  closable={true}>
        <Space direction="vertical" style={{textAlign: "center", width: "100%"}}>
            <GoogleAuth closeModal={closeModal}/>
            <MicrosoftAuth closeModal={closeModal}/>
            <Alert message="Make sure to tick all the checkboxes when authorizing your account"/>
        </Space>
    </Modal>
}