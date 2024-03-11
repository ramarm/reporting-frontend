import {Button, Flex, IconButton} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";
import {Add, Delete} from "monday-ui-react-core/icons";
import {useState} from "react";
import ChooseDialog from "../Chosers/ChooseDialog.jsx";
import ColumnCombobox from "../Chosers/Column.jsx";

export default function Breakdown({setInsight, breakdown, currentStep}) {
    const [isBreakdown, setIsBreakdown] = useState(breakdown !== undefined);
    const isEdit = currentStep.key === "breakdown";

    function removeBreakdown() {
        setInsight("breakdown", undefined);
        setIsBreakdown(false);
    }

    if (isEdit && !isBreakdown) {
        return <Button leftIcon={Add}
                       kind={Button.kinds.TERTIARY}
                       onClick={() => setIsBreakdown(true)}>Add breakdown</Button>;
    }
    if (breakdown || (isEdit && isBreakdown)) {
        return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
            <Heading type={Heading.types.H4}>
                and break it down by
            </Heading>
            <ChooseDialog value={breakdown}
                          setValue={(value) => setInsight("breakdown", value)}
                          placeholder="column"
                          component={ColumnCombobox}
                          childProps={{
                              extraColumns: [{title: "Group", id: "__GROUP__", type: "group"}],
                              columnTypes: ["status", "people", "dropdown"]
                          }}/>
            {isEdit && <IconButton icon={Delete} onClick={removeBreakdown}/>}
        </Flex>
    }
}