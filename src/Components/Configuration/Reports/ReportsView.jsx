import {useState} from "react";
import Loader from "../../Loader/Loader.jsx";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {createReport, getReports} from "../../../Queries/reporting.js";
import {
    Flex,
    Button,
    List,
    ListItem,
    Text,
    ModalHeader,
    ModalContent,
    Checkbox,
    Modal,
    ModalFooter
} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import "./Report.css";
import Report from "./Report.jsx";
import ReportHeader from "./ReportHeader.jsx";
import NoReportsAnimation from "./NoReportsAnimation.json";
import Lottie from "lottie-react";


function ActivateModal({isOpen, closeModal}) {
    return <Modal key="activate-modal"
                  show={isOpen}
                  width={"1000px"}
                  onClose={closeModal}>
        <ModalHeader title=""/>
        <ModalContent>
            <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}>
                <Heading type={Heading.types.H1}>How to activate your template?</Heading>
                <img width="800px" src="/activate-your-template.gif" alt="Activate your template"/>
            </Flex>
        </ModalContent>
        <ModalFooter>
            <Flex justify={Flex.justify.END} gap={Flex.gaps.SMALL}>
                <Checkbox label="Don't show this again"
                          onChange={(e) => {
                              if (e.target.checked) localStorage.setItem("dontShowActivateModal", "TRUE");
                              else localStorage.removeItem("dontShowActivateModal");
                          }}/>
                <Button onClick={closeModal}>
                    Close
                </Button>
            </Flex>
        </ModalFooter>
    </Modal>
}

export default function ReportsView() {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));
    const [activeReportId, setActiveReportId] = useState();
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

    const {data: reports, isLoading: isLoadingReports} = useQuery({
        enabled: !!context.boardId,
        queryKey: ["reports"],
        queryFn: () => getReports({boardId: context.boardId}),
        onError: (error) => {
            console.error("error -", error);
        }
    });

    async function createNewReport() {
        const newReport = await createReport({boardId: context.boardId});
        queryClient.setQueryData(["reports"], (oldData) => {
            return [
                ...oldData,
                newReport
            ];
        });
        setActiveReportId(newReport.id);
    }

    if (reports === undefined || reports === null || isLoadingReports) {
        return <Loader/>
    }

    if (reports.length === 0) {
        return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE}>
            <Heading type={Heading.types.H1}>Welcome to insights</Heading>
            <Text type={Text.types.TEXT1}>First create you report</Text>
            <Lottie animationData={NoReportsAnimation} loop={true}/>
            <Text type={Text.types.TEXT1}>You can do that by clicking this button</Text>
            <Button type="primary"
                    onClick={createNewReport}>Create new report</Button>
        </Flex>
    }

    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.LARGE} style={{padding: "0 20px", width: "auto"}}>
        <Flex justify={Flex.justify.SPACE_BETWEEN} style={{width: "100%"}}>
            <Heading type={Heading.types.H1}>Your reports</Heading>
            <Button type="primary"
                    onClick={createNewReport}>Create new report</Button>
        </Flex>
        <List id="report-list" component={List.components.DIV}>
            {reports
                .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
                .map(report => {
                    return <ListItem key={report.id}
                                     className="report-list-item"
                                     onClick={() => setActiveReportId(report.id)}>
                        <ReportHeader reportId={report.id}/>
                    </ListItem>
                })}
        </List>
        {activeReportId && <Report reportId={activeReportId} setReportId={setActiveReportId}
                                   openActivateModal={() => setIsActivateModalOpen(true)}/>}
        {!isActivateModalOpen && <ActivateModal isOpen={!isActivateModalOpen}
                                                closeModal={() => setIsActivateModalOpen(false)}/>}
    </Flex>
}