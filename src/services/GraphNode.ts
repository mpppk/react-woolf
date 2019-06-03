import { graphlib } from 'dagre';
import { INode } from '../components/Dagre';
import { DiffResults, GraphComponentManager } from './GraphComponentManager';

export class GraphNode {
  private nodeMap: GraphComponentManager<INode> = new GraphComponentManager();
  constructor(private g: graphlib.Graph) {}

  public sync(nodes: INode[]): DiffResults<INode> {
    const diff = this.nodeMap.sync(nodes);
    const [addedNodes, updatedNodes, removedNodes] = diff;
    this.addNodes(addedNodes);
    this.updateNodes(updatedNodes);
    this.removeNodes(removedNodes.map(n => n.name));
    return diff;
  }

  private add(node: INode) {
    this.g.setNode(node.name, node.label);
    this.g.setParent(node.name, node.parent);
    const addedNode = this.g.node(node.name);
    // Round the corners of the nodes
    addedNode.rx = addedNode.ry = 5;
  }

  private addNodes(nodes: INode[]) {
    nodes.forEach(this.add.bind(this));
  }

  private updateNodes(nodes: INode[]) {
    this.removeNodes(nodes.map(n => n.name));
    this.addNodes(nodes);
  }

  private removeNode(nodeName: string) {
    this.g.removeNode(nodeName);
  }

  private removeNodes(nodeNames: string[]): boolean[] {
    return nodeNames.map(this.removeNode.bind(this));
  }
}
