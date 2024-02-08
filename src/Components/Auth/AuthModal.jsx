import {Alert, Modal, Space} from "antd";
import MicrosoftAuth from "./Microsoft.jsx";
import GoogleAuth from "./Google.jsx";

export default function AuthModal({isOpen, closeModal}) {
    return <Modal open={isOpen}
                  footer={null}
                  onCancel={closeModal}
                  closable={true}
                  zIndex={99999}>
        <Space direction="vertical" style={{textAlign: "center", width: "100%"}}>
            <GoogleAuth closeModal={closeModal}/>
            <MicrosoftAuth closeModal={closeModal}/>
            <Alert message="Make sure to tick all the checkboxes when authorizing your account"/>
            <Alert type="warning"
                message="If you are using the monday.com Desktop app those buttons will not work. Please use the web version of monday.com to authorize your account."/>
        </Space>
    </Modal>
}