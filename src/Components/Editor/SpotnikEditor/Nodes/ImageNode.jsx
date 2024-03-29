import {DecoratorNode} from "lexical";


function convertImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const {src, width, height} = domNode;
        const node = $createImageNode({src, width, height});
        return {node};
    }
    return null;
}

export class ImageNode extends DecoratorNode {
    __src
    __width
    __height
    __alt

    constructor({src, width, height, alt, key}) {
        super(key);
        this.__src = src;
        this.__width = width;
        this.__height = height;
        this.__alt = alt || "image";
    }

    static getType() {
        return "image";
    }

    static clone(node) {
        return new ImageNode({
            src: node.__src,
            width: node.__width,
            height: node.__height,
            alt: node.__alt,
            key: node.__key
        });
    }

    static importDOM() {
        return {
            img: () => ({
                conversion: convertImageElement,
                priority: 0
            })
        }
    }

    static importJSON({src, width, height, alt}) {
        return $createImageNode({src, width, height, alt});
    }

    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        if (this.__width) element.setAttribute('width', this.__width);
        if (this.__height) element.setAttribute('height', this.__height);
        element.setAttribute('alt', this.__alt);
        return {element};
    }


    exportJSON() {
        return {
            type: ImageNode.getType(),
            src: this.__src,
            width: this.__width,
            height: this.__height,
            alt: this.__alt
        }
    }

    createDOM() {
        return document.createElement('span');
    }


    updateDOM() {
        return false;
    }


    decorate() {
        if (this.__width && this.__height) return <img src={this.__src}
                                                       width={this.__width}
                                                       height={this.__height}
                                                       alt={this.__alt}/>;
        if (this.__width) return <img src={this.__src}
                                      width={this.__width}
                                      alt={this.__alt}/>;
        if (this.__height) return <img src={this.__src}
                                       height={this.__height}
                                       alt={this.__alt}/>;
        return <img src={this.__src}
                    alt={this.__alt}/>;
    }
}

export function $createImageNode({src, width, height, alt}) {
    return new ImageNode({src, width, height, alt});
}

export function $isImageNode(node) {
    return node instanceof ImageNode;
}