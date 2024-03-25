import {TextNode} from "lexical";

function convertInsightElement(domNode) {
    if (domNode instanceof HTMLElement && domNode.tagName === "INSIGHT") {
        const title = domNode.attributes.getNamedItem("insight-title")?.value;
        const func = domNode.attributes.getNamedItem("insight-function")?.value;
        let column = domNode.attributes.getNamedItem("insight-column")?.value;
        if (column) column = JSON.parse(column);
        let value = domNode.attributes.getNamedItem("insight-value")?.value;
        if (value) value = JSON.parse(value);
        let timespan = domNode.attributes.getNamedItem("insight-timespan")?.value;
        if (timespan) timespan = JSON.parse(timespan);
        let filters = domNode.attributes.getNamedItem("insight-filters")?.value;
        if (filters) filters = JSON.parse(filters);
        let breakdown = domNode.attributes.getNamedItem("insight-breakdown")?.value;
        if (breakdown) breakdown = JSON.parse(breakdown);
        const node = $createInsightNode({
            title,
            func,
            column,
            value,
            timespan,
            filters,
            breakdown
        });

        if (domNode.style.fontWeight === "bold") node.toggleFormat("bold");
        domNode.style.fontWeight = null;
        if (domNode.style.fontStyle === "italic") node.toggleFormat("italic");
        domNode.style.fontStyle = null;
        if (domNode.style.textDecoration.includes("underline")) node.toggleFormat("underline");
        if (domNode.style.textDecoration.includes("line-through")) node.toggleFormat("strikethrough");
        domNode.style.textDecoration = null;
        node.setStyle(domNode.style.cssText);
        return {node};
    }
}

export class InsightNode extends TextNode {
    __function;
    __column;
    __value;
    __timespan;
    __filters;
    __breakdown;

    constructor({text, func, column, value, timespan, filters, breakdown, key}) {
        super(text, key);
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
        const newNode = new InsightNode({
            text: node.__text,
            func: node.__function,
            column: node.__column,
            value: node.__value,
            timespan: node.__timespan,
            filters: node.__filters,
            breakdown: node.__breakdown
        });
        newNode.setFormat(node.__format);
        newNode.setDetail(node.__detail);
        newNode.setMode(node.__mode);
        newNode.setStyle(node.__style);
        return newNode;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: InsightNode.getType(),
            title: this.__text,
            func: this.__function,
            column: this.__column,
            value: this.__value,
            timespan: this.__timespan,
            filters: this.__filters,
            breakdown: this.__breakdown,
            version: 1
        }
    }

    static importJSON(serializedNode) {
        const node = $createInsightNode({
            title: serializedNode.title,
            func: serializedNode.func,
            column: serializedNode.column,
            value: serializedNode.value,
            timespan: serializedNode.timespan,
            filters: serializedNode.filters,
            breakdown: serializedNode.breakdown
        });
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }

    static importDOM() {
        return {
            insight: () => ({
                conversion: convertInsightElement,
                priority: 1
            })
        }
    }

    createDOM(config, editor) {
        const element = super.createDOM(config, editor);
        element.setAttribute("insight-title", this.__text);
        element.setAttribute("insight-function", this.__function);
        if (this.__column) element.setAttribute("insight-column", JSON.stringify(this.__column));
        if (this.__value) element.setAttribute("insight-value", JSON.stringify(this.__value));
        if (this.__timespan) element.setAttribute("insight-timespan", JSON.stringify(this.__timespan));
        if (this.__filters && this.__filters.length > 0) element.setAttribute("insight-filters", JSON.stringify(this.__filters));
        if (this.__breakdown) element.setAttribute("insight-breakdown", JSON.stringify(this.__breakdown));
        return element;
    }

    exportDOM() {
        const element = document.createElement("insight");
        element.setAttribute("insight-title", this.__text);
        element.setAttribute("insight-function", this.__function);
        if (this.__column) element.setAttribute("insight-column", JSON.stringify(this.__column));
        if (this.__value) element.setAttribute("insight-value", JSON.stringify(this.__value));
        if (this.__timespan) element.setAttribute("insight-timespan", JSON.stringify(this.__timespan));
        if (this.__filters && this.__filters.length > 0) element.setAttribute("insight-filters", JSON.stringify(this.__filters));
        if (this.__breakdown) element.setAttribute("insight-breakdown", JSON.stringify(this.__breakdown));

        element.style.cssText = this.__style;
        if (this.hasFormat("bold")) element.style.fontWeight = "bold";
        else element.style.fontWeight = null;
        if (this.hasFormat("italic")) element.style.fontStyle = "italic";
        else element.style.fontStyle = null;
        if (this.hasFormat("underline") && this.hasFormat("strikethrough")) element.style.textDecoration = "underline line-through";
        else if (this.hasFormat("underline")) element.style.textDecoration = "underline";
        else if (this.hasFormat("strikethrough")) element.style.textDecoration += "line-through";
        else element.style.textDecoration = null;
        return {element};
    }

    isToken() {
        return true;
    }

    setInsightData(insightData) {
        const self = this.getWritable();
        self.__function = insightData.function.value;
        self.__column = insightData.column;
        self.__value = insightData.value;
        self.__timespan = insightData.timespan;
        self.__filters = insightData.filters;
        self.__breakdown = insightData.breakdown;
    }

    getTitle() {
        const self = this.getLatest()
        return self.__text.slice(1, -1);
    }

    setTitle(title) {
        const self = this.getWritable();
        self.__text = `{${title}}`;
    }

    getFunction() {
        const self = this.getLatest()
        return self.__function;
    }

    getColumn() {
        const self = this.getLatest()
        return self.__column;
    }

    getValue() {
        const self = this.getLatest()
        return self.__value;
    }

    getTimespan() {
        const self = this.getLatest()
        return self.__timespan
    }

    getFilters() {
        const self = this.getLatest()
        return self.__filters;
    }

    getBreakdown() {
        const self = this.getLatest()
        return self.__breakdown;
    }
}

export function $createInsightNode({title, func, column, value, timespan, filters, breakdown}) {
    return new InsightNode({
        text: title,
        func,
        column,
        value,
        timespan,
        filters,
        breakdown
    });
}

export function $isInsightNode(node) {
    return node instanceof InsightNode;
}
