import { IJobStat } from 'woolf';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import { JobState } from 'woolf/src/scheduler/scheduler';
import { ICluster, INode } from '../src/components/Dagre';
import {
  findJobStatByCluster,
  findJobStatByNode,
  getInputEdge,
  getInputNode,
  getOutputEdge,
  getOutputNode,
  INPUT_NODE_NAME,
  OUTPUT_NODE_NAME,
  statsToClustersAndNodesAndEdges
} from '../src/services/WoolfView';

describe('findJobStatByNode', () => {
  it('can find job by node', async () => {
    const funcStat: JobFuncStat = ({
      FunctionName: 'target-func',
      state: JobFuncState.Ready
    } as any) as JobFuncStat;

    const stats: IJobStat[] = [
      {
        fromJobIDs: [],
        funcs: [funcStat],
        id: 0,
        isStartJob: true,
        isTerminusJob: false,
        name: 'target-job',
        state: JobState.Ready,
        toJobIDs: []
      },
      {
        fromJobIDs: [],
        funcs: [funcStat],
        id: 1,
        isStartJob: false,
        isTerminusJob: true,
        name: 'other-job',
        state: JobState.Ready,
        toJobIDs: []
      }
    ];
    const node: INode = {
      label: undefined,
      name: '0-target-job-target-func',
      parent: ''
    };
    const [jobStat, newFuncStat] = findJobStatByNode(stats, node);
    expect(jobStat).toEqual(stats[0]);
    expect(newFuncStat).toEqual(funcStat);
  });
});

describe('findJobStatByCluster', () => {
  it('can find job by cluster', async () => {
    const stats: IJobStat[] = [
      {
        fromJobIDs: [],
        funcs: [],
        id: 0,
        isStartJob: true,
        isTerminusJob: false,
        name: 'target-job',
        state: JobState.Ready,
        toJobIDs: []
      },
      {
        fromJobIDs: [],
        funcs: [],
        id: 1,
        isStartJob: false,
        isTerminusJob: true,
        name: 'other-job',
        state: JobState.Ready,
        toJobIDs: []
      }
    ];
    const cluster: ICluster = {
      clusterLabelPos: 'top',
      label: undefined,
      name: 'cluster-0'
    };
    const jobStat = findJobStatByCluster(stats, cluster);
    expect(jobStat).toEqual(stats[0]);
  });
});

describe('statsToClustersAndNodesAndEdges', () => {
  it('can convert stats to clusters and nodes and edges', async () => {
    const funcStat0: JobFuncStat = ({
      FunctionName: 'target-func',
      state: JobFuncState.Processing
    } as any) as JobFuncStat;

    const funcStat1: JobFuncStat = ({
      FunctionName: 'other-func',
      state: JobFuncState.Ready
    } as any) as JobFuncStat;

    const stats: IJobStat[] = [
      {
        fromJobIDs: [],
        funcs: [funcStat0],
        id: 0,
        isStartJob: true,
        isTerminusJob: false,
        name: 'target-job',
        state: JobState.Processing,
        toJobIDs: [1]
      },
      {
        fromJobIDs: [0],
        funcs: [funcStat1],
        id: 1,
        isStartJob: false,
        isTerminusJob: true,
        name: 'other-job',
        state: JobState.Ready,
        toJobIDs: []
      }
    ];

    const expectedClusters: ICluster[] = [
      {
        clusterLabelPos: 'top',
        label: {
          class: 'cluster-target-job',
          label: 'target-job',
          style: 'fill: #d3d7e8'
        },
        name: 'cluster-0'
      },
      {
        clusterLabelPos: 'top',
        label: {
          class: 'cluster-other-job',
          label: 'other-job',
          style: 'fill: #d3d7e8'
        },
        name: 'cluster-1'
      }
    ];
    const expectedNodes = [
      {
        label: {
          class: 'node-0-target-job-target-func',
          label: 'target-func(PROCESSING)',
          style: 'fill: #45E810; stroke: #333; stroke-width: 1.5px;'
        },
        name: '0-target-job-target-func',
        parent: 'cluster-0'
      },
      {
        label: {
          class: 'node-1-other-job-other-func',
          label: 'other-func(READY)',
          style: 'fill: #FF9E0F; stroke: #333; stroke-width: 1.5px;'
        },
        name: '1-other-job-other-func',
        parent: 'cluster-1'
      },
      getInputNode(),
      getOutputNode()
    ];
    const expectedEdges = [
      {
        name: '0-target-job-target-func',
        targetId: '1-other-job-other-func',
        value: {
          arrowheadStyle: 'fill: #000',
          style:
            'fill: transparent; stroke: #000; stroke-width: 2px; stroke-dasharray: 5, 5;'
        }
      },
      getInputEdge(INPUT_NODE_NAME, '0-target-job-target-func'),
      getOutputEdge(OUTPUT_NODE_NAME, '1-other-job-other-func')
    ];

    const [clusters, nodes, edges] = statsToClustersAndNodesAndEdges(stats);
    expect(clusters).toEqual(expectedClusters);
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges);
  });
});
