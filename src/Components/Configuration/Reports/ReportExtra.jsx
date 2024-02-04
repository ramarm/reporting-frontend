import {Avatar, Dropdown, Space, Typography} from "antd";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined, LoadingOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {changeOwner, deleteReport, duplicateReport} from "../../../Queries/reporting.js";
import {STORAGE_MONDAY_CONTEXT_KEY} from "../../../consts.js";
import {getUser} from "../../../Queries/monday.js";

const {Text} = Typography;
export default function ReportExtra({report}) {
    const queryClient = useQueryClient();
    const context = JSON.parse(sessionStorage.getItem(STORAGE_MONDAY_CONTEXT_KEY));

    const {data: owner} = useQuery({
        queryKey: ["user", report.owner],
        queryFn: () => getUser({userId: report.owner}),
        enabled: !!report.owner
    })

    const {mutate: changeOwnerMutation} = useMutation({
        mutationFn: () => changeOwner({reportId: report.id}),
        onSuccess: (newOwner) => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return oldData.map((oldReport) => {
                    if (oldReport.id === report.id) {
                        report.owner = newOwner;
                    }
                    return oldReport;
                });
            });
        }
    });

    const {mutate: duplicateMutation} = useMutation({
        mutationFn: () => duplicateReport({reportId: report.id}),
        onSuccess: (newReport) => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return [
                    ...oldData,
                    newReport
                ];
            });
        }
    });

    const {mutate: deleteReportMutation} = useMutation({
        mutationFn: () => deleteReport({reportId: report.id}),
        onSuccess: () => {
            queryClient.setQueryData(["reports"], (oldData) => {
                return oldData.filter((oldReport) => oldReport.id !== report.id);
            });
        }
    });

    return <Space size="middle" style={{height: "22px"}}>
        <Space size="small">
            <Text>Owner:</Text>
            {owner ? (<>
                <Avatar size={22}
                        src={owner.photo_tiny}/>
                <Text style={{maxWidth: "5vw"}} ellipsis={{
                    tooltip: true
                }}>{owner.name}</Text>
            </>) : <LoadingOutlined spin/>}
        </Space>
        <Dropdown onClick={(e) => e.stopPropagation()}
                  menu={{
                      items: [
                          {
                              key: "take_ownership",
                              icon: <UserSwitchOutlined/>,
                              label: <Text>Take ownership</Text>,
                              disabled: report.owner === context.user.id,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                                  changeOwnerMutation();
                              }
                          },
                          {
                              key: "clone",
                              icon: <CopyOutlined/>,
                              label: <Text>Duplicate</Text>,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                                  duplicateMutation();
                              }
                          },
                          {
                              key: "delete",
                              icon: <DeleteOutlined/>,
                              label: <Text>Delete</Text>,
                              onClick: ({domEvent: e}) => {
                                  e.stopPropagation();
                                  deleteReportMutation();
                              }
                          }
                      ]
                  }}>
            <EllipsisOutlined style={{
                fontSize: "26px",
                transform: "rotate(90deg)"
            }}/>
        </Dropdown>
    </Space>
}