import * as React from 'react';
import { JobFuncStat } from 'woolf/src/job';
import { IJobStat } from 'woolf/src/scheduler/scheduler';
import {
  findJobStatByCluster,
  findJobStatByNode,
  DEFAULT_INPUT_NODE_NAME,
  DEFAULT_OUTPUT_NODE_NAME,
  statsToClustersAndNodesAndEdges
} from '../services/WoolfView';
import Dagre, { ICluster, INode } from './Dagre';

interface IWoolfProps {
  stats: IJobStat[];
  width: number | string;
  height: number | string;
  onClickFuncNode: (jobStat: IJobStat, funcStat: JobFuncStat) => void;
  onClickJobNode: (stat: IJobStat) => void;
  onClickInputNode?: () => void;
  onClickOutputNode?: () => void;
  inputNodeLabel: string;
  outputNodeLabel: string;
  showInput: boolean;
  showOutput: boolean;
}

export class WoolfView extends React.Component<IWoolfProps> {
  public static defaultProps: Partial<IWoolfProps> = {
    inputNodeLabel: 'Input',
    outputNodeLabel: 'Output'
  };

  constructor(props) {
    super(props);
    this.handleClickNode = this.handleClickNode.bind(this);
    this.handleClickCluster = this.handleClickCluster.bind(this);
  }

  public handleClickCluster(cluster: ICluster) {
    this.props.onClickJobNode(findJobStatByCluster(this.props.stats, cluster));
  }

  public handleClickNode(node: INode) {
    if (node.name === DEFAULT_INPUT_NODE_NAME) {
      if (this.props.onClickInputNode) {
        this.props.onClickInputNode();
      }
      return;
    }
    if (node.name === DEFAULT_OUTPUT_NODE_NAME) {
      if (this.props.onClickOutputNode) {
        this.props.onClickOutputNode();
      }
      return;
    }
    this.props.onClickFuncNode(...findJobStatByNode(this.props.stats, node));
  }
  // tslint:disable-next-line member-access
  render() {
    const [clusters, nodes, edges] = statsToClustersAndNodesAndEdges(
      this.props.stats,
      {
        showInput: this.props.showInput,
        showOutput: this.props.showOutput,
        inputNodeLabel: this.props.inputNodeLabel,
        outputNodeLabel: this.props.outputNodeLabel
      }
    );

    return (
      <Dagre
        width={this.props.width}
        height={this.props.height}
        clusters={clusters}
        nodes={nodes}
        edges={edges}
        onClickCluster={this.handleClickCluster}
        onClickNode={this.handleClickNode}
      />
    );
  }
}
