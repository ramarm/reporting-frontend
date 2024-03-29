import {Flex, Text, Avatar, Loader} from "monday-ui-react-core";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getUser} from "../../../Queries/monday.js";

export default function Owner({reportId}) {
    const queryClient = useQueryClient();
    const report = queryClient.getQueryData(["reports"]).find((report) => report.id === reportId);

    const {data: owner, isLoading: isLoadingOwner} = useQuery({
        queryKey: ["user", report.owner],
        queryFn: () => getUser({userId: report.owner}),
        enabled: !!report.owner
    });

    return <Flex gap={Flex.gaps.XS}>
        <Text type={Text.types.TEXT2}>Owner:</Text>
        {isLoadingOwner ? <Loader size={Loader.sizes.SMALL}/>
            : [
                <Avatar key="owner-avatar"
                        type={Avatar.types.IMG}
                        size={Avatar.sizes.SMALL}
                        src={owner?.photo_tiny}/>,
                <Text key="owner-name" type={Text.types.TEXT2}>{owner.name}</Text>
            ]}
    </Flex>
}