import {Flex} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.js";
import {Heading} from "monday-ui-react-core/next";
import ChooseDialog from "./Chosers/ChooseDialog.jsx";
import FunctionCombobox from "./Chosers/Function.jsx";
import ColumnCombobox from "./Chosers/Column.jsx";
import TimespanCombobox from "./Chosers/Timespan.jsx";
import ValueCombobox from "./Chosers/Value.jsx";

export default function MainContent({insightData, setInsight}) {
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    const partsComponents = {
        text: ({key, part}) => <Heading key={key} type={Heading.types.H1}>
            {part.text}
        </Heading>,
        column: ({key, part}) => <ChooseDialog key={key}
                                               insightData={insightData}
                                               setInsight={setInsight}
                                               type="column"
                                               placeholder="column"
                                               component={ColumnCombobox}
                                               childProps={part.props}/>,
        value: ({key}) => <ChooseDialog key={key}
                                        insightData={insightData}
                                        setInsight={setInsight}
                                        type="value"
                                        placeholder="value"
                                        component={ValueCombobox}
                                        childProps={{
                                            selectedColumnId: insightData.column?.value
                                        }}/>,
        timespan: ({key}) => <ChooseDialog key={key}
                                           insightData={insightData}
                                           setInsight={setInsight}
                                           type="timespan"
                                           placeholder="in time"
                                           component={TimespanCombobox}/>
    }

    if (!chosenFunction) {
        return <ChooseDialog insightData={insightData}
                             setInsight={setInsight}
                             type="function"
                             placeholder="Function"
                             component={FunctionCombobox}/>
    }

    return <Flex justify={Flex.justify.CENTER} gap={Flex.gaps.SMALL} wrap={true}>
        {chosenFunction.parts.map((part, index) => {
            return partsComponents[part.type]({key: index, part})
        })}
    </Flex>
}