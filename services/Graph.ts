import { graphlib } from 'dagre';
import * as dagreD3 from 'dagre-d3';
import { ICluster, IEdge, INode } from '../components/Dagre';
import { GraphCluster } from './GraphCluster';
import { GraphEdge } from './GraphEdge';
import { GraphNode } from './GraphNode';

export class Graph {
  public readonly nodes: GraphNode;
  public readonly clusters: GraphCluster;
  public readonly edges: GraphEdge;

  private readonly g: graphlib.Graph;

  constructor(clusters: ICluster[], nodes: INode[], edges: IEdge[]) {
    this.g = new dagreD3.graphlib.Graph({ compound: true })
      .setGraph({})
      .setDefaultEdgeLabel(() => {
        return {};
      });

    this.nodes = new GraphNode(this.g);
    this.clusters = new GraphCluster(this.g);
    this.edges = new GraphEdge(this.g);
    this.nodes.sync(nodes);
    this.clusters.sync(clusters);
    this.edges.sync(edges);
  }

  public toGraph(): graphlib.Graph {
    return this.g;
  }
}
