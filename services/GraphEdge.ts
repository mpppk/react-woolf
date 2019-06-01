import { graphlib } from 'dagre';
import { IEdge } from '../components/Dagre';
import { DiffResults, GraphComponentManager } from './GraphComponentManager';

export class GraphEdge {
  private edgeMap: GraphComponentManager<IEdge> = new GraphComponentManager();
  constructor(private g: graphlib.Graph) {}

  public sync(edges: IEdge[]): DiffResults<IEdge> {
    const diff = this.edgeMap.sync(edges);
    const [addedEdges, updatedEdges, removedEdges] = diff;
    this.addEdges(addedEdges);
    this.updateEdges(updatedEdges);
    this.removeEdges(removedEdges);
    return diff;
  }

  private add(edge: IEdge) {
    this.g.setEdge(edge.name, edge.targetId, edge.value);
  }

  private addEdges(edges: IEdge[]) {
    edges.forEach(this.add.bind(this));
  }

  private updateEdges(edges: IEdge[]) {
    this.removeEdges(edges);
    this.addEdges(edges);
  }

  private removeNode(edge: IEdge) {
    this.g.removeEdge(edge.name, edge.targetId);
  }

  private removeEdges(edges: IEdge[]): boolean[] {
    return edges.map(this.removeNode.bind(this));
  }
}
