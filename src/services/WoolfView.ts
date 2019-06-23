import * as _ from 'lodash';
import { IJobStat } from 'woolf';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import { ICluster, IEdge, INode } from '../components/Dagre';

const funcStateToColorCode = (state: JobFuncState): string => {
  switch (state) {
    case JobFuncState.Done:
      return '#a0ffb3';
    case JobFuncState.Ready:
      return '#FF9E0F';
    case JobFuncState.Processing:
      return '#45E810';
  }
};

export const findJobStatByNode = (
  stats: IJobStat[],
  node: INode
): [IJobStat, JobFuncStat] => {
  for (const stat of stats) {
    const funcStatIndex = stat.funcs.find(
      funcStat => toNodeName(stat, funcStat) === node.name
    );
    if (funcStatIndex !== undefined) {
      return [stat, funcStatIndex];
    }
  }
  throw new Error(
    'No stat with the specified node name exists. name: ' + node.name
  );
};

export const findJobStatByCluster = (
  stats: IJobStat[],
  cluster: ICluster
): IJobStat => {
  const stat = stats.find(s => toClusterName(s) === cluster.name);
  if (stat === undefined) {
    throw new Error('cluster does not exist in stats: ' + cluster.name);
  }
  return stat;
};

export const copyGraphComponents = <Component extends { label: object }>(
  components: Component[]
) => {
  // FIXME any
  return components.map(c => ({ ...(c as any), label: { ...c.label } }));
};

export const copyEdges = (edges: IEdge[]): IEdge[] => {
  return edges.map(e => ({ ...e, value: { ...e.value } }));
};

const findJobStatByID = (stats: IJobStat[], id: number) => {
  const jobStat = stats.find(stat => stat.id === id);
  if (jobStat === undefined) {
    throw new Error('job does not exist. id: ' + id);
  }

  if (jobStat.funcs.length === 0) {
    throw new Error('job does not have any funcs. name: ' + jobStat.name);
  }
  return jobStat;
};

const jobIDToLastNodeName = (stats: IJobStat[], id: number): string => {
  const jobStat = findJobStatByID(stats, id);
  const funcStat = jobStat.funcs[jobStat.funcs.length - 1];
  return toNodeName(jobStat, funcStat);
};

const jobIDToFirstNodeName = (stats: IJobStat[], id: number) => {
  const jobStat = findJobStatByID(stats, id);
  const funcStat = jobStat.funcs[0];
  return toNodeName(jobStat, funcStat);
};

const toNodeName = (stat: IJobStat, funcStat: JobFuncStat) => {
  return `${stat.id}-${stat.name}-${funcStat.FunctionName}`;
};

const toClusterName = (jobStat: IJobStat) => {
  return 'cluster-' + String(jobStat.id);
};

interface StatsToClustersAndNodesAndEdgesOptions {
  showInput: boolean;
  showOutput: boolean;
}

const defaultStatsToClustersAndNodesAndEdgesOptions: StatsToClustersAndNodesAndEdgesOptions = {
  showInput: true,
  showOutput: true
};

export const statsToClustersAndNodesAndEdges = (
  stats: IJobStat[],
  options?: Partial<StatsToClustersAndNodesAndEdgesOptions>
): [ICluster[], INode[], IEdge[]] => {
  let mergedOptions = defaultStatsToClustersAndNodesAndEdgesOptions;
  if (options !== undefined) {
    mergedOptions = {
      ...mergedOptions,
      ...options
    };
  }

  const clusters: ICluster[] = stats.map(
    (stat): ICluster => {
      return {
        clusterLabelPos: 'top',
        label: {
          class: 'cluster-' + stat.name,
          label: stat.name,
          style: 'fill: #d3d7e8'
        },
        name: toClusterName(stat)
      };
    }
  );

  const funcNodes: INode[][] = stats.map(stat => {
    return stat.funcs.map(
      (funcStat): INode => {
        return {
          label: {
            class: 'node-' + toNodeName(stat, funcStat),
            label: `${funcStat.FunctionName}(${funcStat.state})`,
            style: `fill: ${funcStateToColorCode(
              funcStat.state
            )}; stroke: #333; stroke-width: 1.5px;`
          },
          name: toNodeName(stat, funcStat),
          parent: toClusterName(stat)
        };
      }
    );
  });

  const funcEdges: IEdge[][] = stats.map(stat => {
    const es: IEdge[] = [];
    for (let i = 1; i < stat.funcs.length; i++) {
      es.push({
        name: toNodeName(stat, stat.funcs[i - 1]),
        targetId: toNodeName(stat, stat.funcs[i]),
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      });
    }
    return es;
  });

  const edges: IEdge[][] = stats.map(stat => {
    return stat.toJobIDs.map(toJobID => {
      return {
        name: jobIDToLastNodeName(stats, stat.id),
        targetId: jobIDToFirstNodeName(stats, toJobID),
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      };
    });
  });

  const otherNodes = [] as INode[];
  const otherEdges = [] as IEdge[];
  if (mergedOptions.showInput) {
    const startJobIndices = stats
      .map((stat, index) => {
        return stat.isStartJob ? index : undefined;
      })
      .filter(i => i !== undefined);
    const startClusterNames = [] as string[];
    for (const index of startJobIndices) {
      const stat = stats[index];
      startClusterNames.push(toClusterName(stat));
    }

    const startJobFuncNodes = funcNodes
      .filter(funcNode => {
        if (funcNode.length === 0) {
          return false;
        }
        if (startClusterNames.includes(funcNode[0].parent)) {
          return true;
        }
      })
      .map(nodes => nodes[0]);

    const inputNode = getInputNode();
    otherNodes.push(inputNode);

    for (const node of startJobFuncNodes) {
      otherEdges.push(getInputEdge(inputNode.name, node.name));
    }
  }

  if (mergedOptions.showOutput) {
    const terminusJobIndices = stats
      .map((stat, index) => {
        return stat.isTerminusJob ? index : undefined;
      })
      .filter(i => i !== undefined);
    const terminusClusterNames = [] as string[];
    for (const index of terminusJobIndices) {
      const stat = stats[index];
      terminusClusterNames.push(toClusterName(stat));
    }
    const terminusJobFuncNodes = funcNodes
      .filter(funcNode => {
        if (funcNode.length === 0) {
          return false;
        }
        if (terminusClusterNames.includes(funcNode[0].parent)) {
          return true;
        }
      })
      .map(nodes => nodes[nodes.length - 1]);

    const outputNode = getOutputNode();
    otherNodes.push(outputNode);

    for (const node of terminusJobFuncNodes) {
      otherEdges.push(getOutputEdge(outputNode.name, node.name));
    }
  }

  const nodes = _.flatten(funcNodes);
  return [
    clusters,
    [...nodes, ...otherNodes],
    [..._.flatten([...edges, ...funcEdges]), ...otherEdges]
  ];
};

const getInputNode = (): INode => {
  return {
    label: {
      class: 'input',
      label: `Input`,
      style: `fill: gold; stroke: #333; stroke-width: 1.5px;`
    },
    name: 'input'
  };
};

const getInputEdge = (
  inputNodeName: string,
  firstFuncNodeName: string
): IEdge => {
  return {
    name: inputNodeName,
    targetId: firstFuncNodeName,
    value: {
      arrowheadStyle: 'fill: #000',
      style:
        'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
    }
  };
};

const getOutputNode = (): INode => {
  return {
    label: {
      class: 'output',
      label: `Output`,
      style: `fill: gold; stroke: #333; stroke-width: 1.5px;`
    },
    name: 'output'
  };
};

const getOutputEdge = (
  outputNodeName: string,
  lastFuncNodeName: string
): IEdge => {
  return {
    name: lastFuncNodeName,
    targetId: outputNodeName,
    value: {
      arrowheadStyle: 'fill: #000',
      style:
        'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
    }
  };
};
