import {Flex} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.js";
import {Heading} from "monday-ui-react-core/next";
import ChooseDialog from "./Chosers/ChooseDialog.jsx";
import FunctionCombobox from "./Chosers/Function.jsx";
import ColumnCombobox from "./Chosers/Column.jsx";

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