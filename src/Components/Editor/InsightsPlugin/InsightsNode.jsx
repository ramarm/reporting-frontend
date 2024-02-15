import {DecoratorNode} from "lexical";

function convertInsightElement(domNode) {
    if (domNode instanceof HTMLElement && domNode.tagName === "INSIGHT") {
        const title = domNode.attributes.getNamedItem("title").value;
        const func = domNode.attributes.getNamedItem("func").value;
        const column = domNode.attributes.getNamedItem("column").value;
        const value = domNode.attributes.getNamedItem("value").value;
        const timespan = domNode.attributes.getNamedItem("timespan").value;
        const filters = domNode.attributes.getNamedItem("filters").value;
        const breakdown = domNode.attributes.getNamedItem("breakdown").value;
        const node = $createInsightNode({title, func, column, value, timespan, filters, breakdown});
        return {node};
    }
}

export class InsightNode extends DecoratorNode {
    __title
    __function
    __column
    __value
    __timespan
    __filters
    __breakdown

    constructor({title, func, column, value, timespan, filters, breakdown, key}) {
        super(key);
        this.__title = title;
        this.__function = func;
        this.__column = column;
        this.__value = value;
        this.__timespan = timespan;
        this.__filters = filters;
        this.__breakdown = breakdown;
    }

    static getType() {
        return "insight";
    }

    static clone(node) {
        return new InsightNode({
            title: node.__title,
            func: node.__function,
            column: node.__column,
            value: node.__value,
            timespan: node.__timespan,
            filters: node.__filters,
            breakdown: node.__breakdown,
            key: node.__key
        });
    }

    static importDOM() {
        return {
            insight: () => ({
                conversion: convertInsightElement,
                priority: 0
            })
        }
    }

    static importJSON({title, func, column, value, timespan, filters, breakdown}) {
        return $createInsightNode({title, func, column, value, timespan, filters, breakdown});
    }

    exportDOM() {
        const element = document.createElement('insight');
        element.setAttribute('title', this.__title);
        element.setAttribute('func', this.__function);
        element.setAttribute('column', this.__column);
        element.setAttribute('value', this.__value);
        element.setAttribute('timespan', this.__timespan);
        element.setAttribute('filters', this.__filters);
        element.setAttribute('breakdown', this.__breakdown);
        return {element};
    }

    exportJSON() {
        return {
            type: InsightNode.getType(),
            title: this.__title,
            func: this.__function,
            column: this.__column,
            value: this.__value,
            timespan: this.__timespan,
            filters: this.__filters,
            breakdown: this.__breakdown
        }
    }

    createDOM() {
        return document.createElement('span');
    }

    updateDOM() {
        return false;
    }

    decorate() {
        return <span style={{borderRadius: "5px", backgroundColor: "lightblue"}}>{this.__title}</span>;
    }
}

export function $createInsightNode({title, func, column, value, timespan, filters, breakdown}) {
    return new InsightNode({title, func, column, value, timespan, filters, breakdown});
}

export function $isInsightNode(node) {
    return node instanceof InsightNode;
}