import {useMutation, useQueryClient} from "@tanstack/react-query";
import {patchReport} from "../../../Queries/reporting.js";
import From from "./From.jsx";
import Recipients from "./Recipients.jsx";
import ReportingEditor from "../../Editor/ReportingEditor.jsx";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {
    Flex,
    Modal,
    ModalContent,
    ModalHeader,
    EditableHeading,
    IconButton,
    TextField,
    Divider
} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {CloseSmall} from "monday-ui-react-core/icons";

export default function Report({setReportId, reportId}) {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);
    const editable = report.owner === Number(context.user.id);


    const {mutate: patchReportMutation} = useMutation({
        mutationFn: ({reportId, key, value}) => patchReport({reportId, key, value}),
        onSuccess: ({key, value}) => {
            updateReport(key, value);
        }
    })

    function setReport(key, value) {
        patchReportMutation({reportId, key, value});
    }

    function updateReport(key, value) {
        queryClient.setQueryData(["reports"], (oldData) => {
            const newData = [...oldData];
            const reportIndex = newData.findIndex((report) => report.id === reportId);
            const newReport = {...newData[reportIndex]};
            newReport[key] = value;
            newData[reportIndex] = newReport;
            return newData;
        });
    }

    function setReportName(name) {
        setReport("name", name);
    }

    function setReportSubject(subject) {
        setReport("subject", subject);
    }

    function closeModal() {
        setReportId();
    }

    return <Modal id="report-modal"
                  classNames={{container: "report-modal-container", modal: 'report-modal'}}
                  show={reportId}
                  onClose={closeModal}>
        <ModalHeader className="report-modal-header"
                     title=""
                     icon={null}>
            <Flex style={{height: "100%"}} justify={Flex.justify.SPACE_BETWEEN}>
                <EditableHeading type={Heading.types.H3} style={{width: "auto"}}
                                 disabled={!editable}
                                 placeholder="Report name"
                                 value={report.name}
                                 onChange={setReportName}/>
                <Flex gap={Flex.gaps.SMALL}>
                    <From editable={editable}
                          from={report.sender}
                          updateFrom={(from) => setReport("sender", from)}/>
                    <IconButton size={IconButton.sizes.SMALL}
                                icon={CloseSmall}
                                onClick={closeModal}/>
                </Flex>
            </Flex>
        </ModalHeader>
        <ModalContent className="report-modal-content">
            <Flex direction={Flex.directions.COLUMN} style={{height: "100%"}}>
                <Recipients reportId={reportId}
                            setReport={setReport}
                            editable={editable}/>
                <TextField placeholder="Subject"
                           size={TextField.sizes.MEDIUM}
                           disabled={!editable}
                           value={report.subject}
                           onChange={setReportSubject}/>
                <Divider key="divider"/>
                <ReportingEditor initialValue={report.body} disabled={!editable}
                                 onChange={(value) => setReport("body", value)}/>
            </Flex>
        </ModalContent>
    </Modal>
}