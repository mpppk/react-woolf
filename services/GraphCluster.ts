import { graphlib, Label } from 'dagre';
import { ICluster } from '../components/Dagre';
import { DiffResults, GraphComponentManager } from './GraphComponentManager';

export class GraphCluster {
  private static toNodeProperty(cluster: ICluster): [string, Label] {
    const label = {
      ...cluster.label,
      clusterLabelPos: cluster.clusterLabelPos
    };

    return [cluster.name, label];
  }

  private clusterMap = new GraphComponentManager<ICluster>();
  constructor(private g: graphlib.Graph) {}

  public sync(clusters: ICluster[]): DiffResults<ICluster> {
    const diff = this.clusterMap.sync(clusters);
    const [addedClusters, updatedClusters, removedClusters] = diff;
    this.addClusters(addedClusters);
    this.updateClusters(updatedClusters);
    this.removeClusters(removedClusters.map(n => n.name));
    return diff;
  }

  private add(cluster: ICluster) {
    this.g.setNode(...GraphCluster.toNodeProperty(cluster));
  }

  private addClusters(clusters: ICluster[]) {
    clusters.forEach(this.add.bind(this));
  }

  private updateClusters(clusters: ICluster[]) {
    this.removeClusters(clusters.map(n => n.name));
    this.addClusters(clusters);
  }

  private removeCluster(clusterName: string) {
    this.g.removeNode(clusterName);
  }

  private removeClusters(clusterNames: string[]): boolean[] {
    return clusterNames.map(this.removeCluster.bind(this));
  }
}
