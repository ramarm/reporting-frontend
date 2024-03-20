import {Flex} from "monday-ui-react-core";
import {FUNCTIONS} from "../insightsFunctions.jsx";
import Function from "../Steps/Function.jsx";
import Configuration from "../Steps/Configuration.jsx";
import Filters from "../Steps/Filters.jsx";
import Preview from "../Steps/Preview.jsx";

export default function MainContent({insightData, setInsight, currentStep}) {
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    if (!chosenFunction) {
        return <Function insightData={insightData} setInsight={setInsight}/>
    }

    if (currentStep.key === "preview") {
        return <Preview chosenFunction={chosenFunction} insightData={insightData}/>
    }

    return <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.XS}>
        <Configuration insightData={insightData} setInsight={setInsight} chosenFunction={chosenFunction}/>
        <Filters insightData={insightData} setInsight={setInsight} currentStep={currentStep}/>
    </Flex>
}