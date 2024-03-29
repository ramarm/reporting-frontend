import {Flex} from "monday-ui-react-core";
import ChooseDialog from "../Dropdowns/ChooseDialog.jsx";
import FunctionCombobox from "../Dropdowns/Function.jsx";

export default function Function({insightData, setInsight}) {
    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
        <ChooseDialog value={insightData.function}
                      setValue={(value) => setInsight("function", value)}
                      placeholder="Function"
                      component={FunctionCombobox}/>
    </Flex>
}