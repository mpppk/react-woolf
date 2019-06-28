import * as _ from 'lodash';
import { IJobStat } from 'woolf';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import { ICluster, IEdge, INode } from '../components/Dagre';
import { filterIndex } from './util';
import { JobEnvironment } from 'woolf/src/scheduler/scheduler';

export const DEFAULT_INPUT_NODE_NAME = 'input';
export const DEFAULT_OUTPUT_NODE_NAME = 'output';
export const DEFAULT_INPUT_NODE_LABEL = 'Input';
export const DEFAULT_OUTPUT_NODE_LABEL = 'Output';

const funcStateToColorCode = (
  state: JobFuncState,
  env: JobEnvironment
): string => {
  switch (state) {
    case JobFuncState.Done:
      return '#a0ffb3';
    case JobFuncState.Ready:
      return '#FF9E0F';
    case JobFuncState.Processing:
      return env === 'local' ? '#45E810' : 'seagreen';
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
  inputNodeLabel: string;
  outputNodeLabel: string;
}

const defaultStatsToClustersAndNodesAndEdgesOptions: StatsToClustersAndNodesAndEdgesOptions = {
  showInput: true,
  showOutput: true,
  inputNodeLabel: DEFAULT_INPUT_NODE_LABEL,
  outputNodeLabel: DEFAULT_OUTPUT_NODE_LABEL
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
        const env =
          funcStat.state === JobFuncState.Ready
            ? ''
            : ' on ' + stat.environment;
        return {
          label: {
            class: 'node-' + toNodeName(stat, funcStat),
            label: `${funcStat.FunctionName}(${funcStat.state}${env})`,
            style: `fill: ${funcStateToColorCode(
              funcStat.state,
              stat.environment
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
    const [node, edges] = getInputNodeAndEdge(
      stats,
      funcNodes,
      mergedOptions.inputNodeLabel
    );
    otherNodes.push(node);
    edges.forEach(edge => otherEdges.push(edge));
  }

  if (mergedOptions.showOutput) {
    const [node, edges] = getOutputNodeAndEdge(
      stats,
      funcNodes,
      mergedOptions.outputNodeLabel
    );
    otherNodes.push(node);
    edges.forEach(edge => otherEdges.push(edge));
  }

  const nodes = _.flatten(funcNodes);
  return [
    clusters,
    [...nodes, ...otherNodes],
    [..._.flatten([...edges, ...funcEdges]), ...otherEdges]
  ];
};

const getClusterNamesByIndex = (stats: IJobStat[], indices: number[]) => {
  return indices.map(index => {
    const stat = stats[index];
    return toClusterName(stat);
  });
};

const getFuncNodesByClusterNames = (
  funcNodes: INode[][],
  clusterNames: string[]
) => {
  return funcNodes.filter(funcNode => {
    if (funcNode.length === 0) {
      return false;
    }
    if (clusterNames.includes(funcNode[0].parent)) {
      return true;
    }
  });
};

export const getInputNode = (label: string): INode => {
  return {
    label: {
      class: DEFAULT_INPUT_NODE_NAME,
      label,
      style: `fill: gold; stroke: #333; stroke-width: 1.5px;`
    },
    name: DEFAULT_INPUT_NODE_NAME
  };
};

export const getInputEdge = (
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

const getInputNodeAndEdge = (
  stats: IJobStat[],
  funcNodes: INode[][],
  inputNodeLabel: string
): [INode, IEdge[]] => {
  const startJobIndices = filterIndex(stats, stat => stat.isStartJob);
  const startClusterNames = getClusterNamesByIndex(stats, startJobIndices);
  const startJobFuncNodes = getFuncNodesByClusterNames(
    funcNodes,
    startClusterNames
  ).map(nodes => nodes[0]);

  const inputNode = getInputNode(inputNodeLabel);
  return [
    inputNode,
    startJobFuncNodes.map(node => getInputEdge(inputNode.name, node.name))
  ];
};

const getOutputNodeAndEdge = (
  stats: IJobStat[],
  funcNodes: INode[][],
  outputNodeLabel: string
): [INode, IEdge[]] => {
  const terminusJobIndices = filterIndex(stats, stat => stat.isTerminusJob);
  const terminusClusterNames = getClusterNamesByIndex(
    stats,
    terminusJobIndices
  );
  const terminusJobFuncNodes = getFuncNodesByClusterNames(
    funcNodes,
    terminusClusterNames
  ).map(nodes => nodes[nodes.length - 1]);

  const outputNode = getOutputNode(outputNodeLabel);
  return [
    outputNode,
    terminusJobFuncNodes.map(node => getOutputEdge(outputNode.name, node.name))
  ];
};

export const getOutputNode = (label: string): INode => {
  return {
    label: {
      class: DEFAULT_OUTPUT_NODE_NAME,
      label,
      style: `fill: gold; stroke: #333; stroke-width: 1.5px;`
    },
    name: DEFAULT_OUTPUT_NODE_NAME
  };
};

export const getOutputEdge = (
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
