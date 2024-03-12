import {Flex} from "monday-ui-react-core";
import {FUNCTIONS} from "./insightsFunctions.js";
import Function from "./Steps/Function.jsx";
import Configuration from "./Steps/Configuration.jsx";
import Filters from "./Steps/Filters.jsx";
import Breakdown from "./Steps/Breakdown.jsx";
import Preview from "./Steps/Preview.jsx";

export default function MainContent({insightData, setInsight, currentStep}) {
    const chosenFunction = FUNCTIONS.find((f) => f.value === insightData.function?.value);

    if (!chosenFunction) {
        return <Function insightData={insightData} setInsight={setInsight}/>
    }

    return <Flex className="insight-modal-content" justify={Flex.justify.SPACE_AROUND}>
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL}>
            <Configuration insightData={insightData} setInsight={setInsight} chosenFunction={chosenFunction}/>
            <Filters filters={insightData.filters} setInsight={setInsight} currentStep={currentStep}/>
            <Breakdown breakdown={insightData.breakdown} setInsight={setInsight} currentStep={currentStep}/>
        </Flex>
        {currentStep.key === "preview" && <Preview chosenFunction={chosenFunction} insightData={insightData}/>}
    </Flex>
}