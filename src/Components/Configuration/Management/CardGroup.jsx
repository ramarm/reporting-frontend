import {Flex, Box} from "monday-ui-react-core";
import {Heading} from "monday-ui-react-core/next";

export default function CardGroup({title, cards}) {
    return <Box className="management-group-box" border={Box.borders.DEFAULT}
                shadow={Box.shadows.SMALL}
                rounded={Box.roundeds.MEDIUM}>
        <Flex direction={Flex.directions.COLUMN} gap={Flex.gaps.SMALL} style={{width: "100%"}}>
            <Flex direction={Flex.directions.COLUMN} align={Flex.align.START} style={{width: "100%"}}>
                <Heading type={Heading.types.H3} className="management-card-title">{title}</Heading>
            </Flex>
            <Flex className="management-group-body" gap={Flex.gaps.LARGE} style={{width: "100%"}}>
                {cards.map((card) => card)}
            </Flex>
        </Flex>
    </Box>
}