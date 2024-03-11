import {Flex} from "monday-ui-react-core";
import ChooseDialog from "../Chosers/ChooseDialog.jsx";
import FunctionCombobox from "../Chosers/Function.jsx";

export default function Function({insightData, setInsight}) {
    return <Flex className="insight-modal-content" direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
        <ChooseDialog className="insight-modal-content"
                      value={insightData.function}
                      setValue={(value) => setInsight("function", value)}
                      placeholder="Function"
                      component={FunctionCombobox}/>
    </Flex>
}