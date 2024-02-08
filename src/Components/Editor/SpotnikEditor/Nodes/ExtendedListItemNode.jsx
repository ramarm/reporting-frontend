import {ListItemNode} from "@lexical/list";


export class ExtendedListItemNode extends ListItemNode {
    static getType() {
        return "extended-list-item";
    }

    static clone(node) {
        return new ExtendedListItemNode(node.getValue(), node.getChecked());
    }

    static importJSON(serializedNode) {
        return ExtendedListItemNode.clone(ListItemNode.importJSON(serializedNode));
    }

    exportJSON() {
        const serialized = super.exportJSON();
        serialized.type = ExtendedListItemNode.getType();
        return serialized;
    }

    setFormat(type) {
        if (this.getParent()) {
            this.getParent().setFormat(type);
        }
        return super.setFormat(type);
    }

    createDOM(config) {
        const element = super.createDOM(config);
        element.style.direction = this.getParent().getDirection();
        return element;
    }
}

