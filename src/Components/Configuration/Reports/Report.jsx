import {useQueryClient} from "@tanstack/react-query";
import From from "./From.jsx";
import Recipients from "./Recipients.jsx";
import ReportingEditor from "../../Editor/ReportingEditor.jsx";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {
    Flex,
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    EditableText,
    IconButton,
    TextField,
    Divider,
    Button,
    Toast,
    Text,
} from "monday-ui-react-core";
import {CloseSmall} from "monday-ui-react-core/icons";
import Owner from "./Owner.jsx";
import {DeleteReport, TakeOwnership} from "./ReportActionButtons.jsx";
import {useState} from "react";
import SendNowButton from "./SendNow.jsx";

export default function Report({setReportId, reportId, setReport, openActivateModal}) {
    const queryClient = useQueryClient();
    const [didSaveNotified, setDidSaveNotified] = useState(false);
    const [isSaveNotifyOpen, setIsSaveNotifyOpen] = useState(false);
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);
    const editable = report.owner === Number(context.user.id);
    const [tempSubject, setTempSubject] = useState(report.subject || "");

    function _setReport(key, value) {
        if (!didSaveNotified) {
            setIsSaveNotifyOpen(true);
            setDidSaveNotified(true);
        }
        setReport(key, value);
    }

    function setReportName(name) {
        _setReport("name", name);
    }

    function setReportSubject(subject) {
        setTempSubject(subject);
        _setReport("subject", subject);
    }

    function closeModal() {
        setReportId();
    }

    function countInsights() {
        const insightsCount = (report.body?.match(/<insight\s.*?>/g) || []).length;
        return <Text key="Insight count" type={Text.types.TEXT2}>Insights count: {insightsCount}</Text>;
    }

    return <Modal id="report-modal"
                  classNames={{container: "report-modal-container", modal: 'report-modal'}}
                  show={reportId}
                  onClose={closeModal}>
        <ModalHeader className="report-modal-header"
                     title=""
                     icon={null}>
            <Flex style={{height: "100%"}} justify={Flex.justify.SPACE_BETWEEN}>
                <EditableText type={EditableText.types.TEXT1}
                              readOnly={!editable}
                              placeholder="Report name"
                              value={report.name || ""}
                              onChange={setReportName}/>
                <Flex gap={Flex.gaps.SMALL}>
                    {countInsights()}
                    <Divider className="report-modal-header-divider" direction={Divider.directions.VERTICAL}/>
                    <Owner reportId={reportId}/>
                    {!editable && <TakeOwnership reportId={reportId}/>}
                    {editable && <DeleteReport reportId={reportId} onClick={closeModal}/>}
                    <IconButton size={IconButton.sizes.SMALL}
                                icon={CloseSmall}
                                onClick={closeModal}/>
                </Flex>
            </Flex>
        </ModalHeader>
        <ModalContent className="report-modal-content">
            <Flex direction={Flex.directions.COLUMN} style={{height: "100%"}}>
                <From editable={editable}
                      from={report.sender}
                      updateFrom={(from) => _setReport("sender", from)}/>
                <Divider className="report-divider"/>
                <Recipients reportId={reportId}
                            setReport={_setReport}
                            editable={editable}/>
                <TextField placeholder="Subject"
                           className="subject-input"
                           debounceRate={500}
                           size={TextField.sizes.MEDIUM}
                           disabled={!editable}
                           value={tempSubject}
                           onChange={setReportSubject}/>
                <Divider key="divider" className="report-divider"/>
                <ReportingEditor initialValue={report.body} disabled={!editable}
                                 onChange={(value) => _setReport("body", value)}
                                 containerSelector="#report-modal"/>
                <Toast open={isSaveNotifyOpen} className="auto-save-toast" autoHideDuration={5000}
                       onClose={() => setIsSaveNotifyOpen(false)}>
                    Your changes will be saved automatically
                </Toast>
            </Flex>
        </ModalContent>
        <ModalFooter className="report-footer">
            <Flex justify={Flex.justify.END} style={{padding: "0 15px 10px 15px"}}>
                {editable ? <Flex gap={Flex.gaps.SMALL}>
                        <SendNowButton size={Button.sizes.LARGE} report={report}/>
                        <Button size={Button.sizes.LARGE}
                                onClick={() => {
                                    if (localStorage.getItem("dontShowActivateModal")?.toUpperCase() === "TRUE") closeModal();
                                    else {
                                        openActivateModal();
                                        closeModal();
                                    }
                                }}>
                            Done
                        </Button>
                    </Flex>
                    : <Button kind={Button.kinds.SECONDARY}
                              size={Button.sizes.LARGE}
                              onClick={closeModal}>
                        Close
                    </Button>}
            </Flex>
        </ModalFooter>
    </Modal>
}