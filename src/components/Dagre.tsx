import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import { Label } from 'dagre-d3';
import * as React from 'react';
import * as isEqual from 'react-fast-compare';
import { Graph } from '../services/Graph';
import { copyEdges, copyGraphComponents } from '../services/WoolfView';

const getEvent = () => require('d3-selection').event;

export interface ICluster {
  name: string;
  label: Label;
  clusterLabelPos: 'top' | 'bottom' | 'left' | 'right'; // FIXME
}

export interface INode {
  name: string;
  label: Label;
  parent?: string;
}

export interface IEdge {
  name: string;
  targetId: string;
  value: Label;
}

interface IDagreProps {
  clusters: ICluster[];
  nodes: INode[];
  edges: IEdge[];
  zoom: number;
  width: number;
  height: number;
  onClickNode: (node: INode) => void;
  onClickCluster: (cluster: ICluster) => void;
  // onComponentDidMount: () => void;
}

class Dagre extends React.Component<IDagreProps> {
  // tslint:disable-next-line member-access
  static defaultProps = {
    zoom: '2'
  };
  private node: any;
  private g: Graph;

  constructor(props) {
    super(props);
    this.handleClickCluster = this.handleClickCluster.bind(this);
    this.handleClickNode = this.handleClickNode.bind(this);
  }

  // tslint:disable-next-line member-access
  shouldComponentUpdate(nextProps, _nextState) {
    const shouldUpdate =
      !isEqual(this.props.nodes, nextProps.nodes) ||
      !isEqual(this.props.edges, nextProps.edges) ||
      !isEqual(this.props.zoom, nextProps.zoom);
    return shouldUpdate;
  }

  // tslint:disable-next-line member-access
  componentDidMount() {
    this.g = new Graph(this.props.clusters, this.props.nodes, this.props.edges);
    this.renderGraph();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate() {
    this.g.clusters.sync(copyGraphComponents(this.props.clusters));
    this.g.nodes.sync(copyGraphComponents(this.props.nodes));
    this.g.edges.sync(copyEdges(this.props.edges));
    this.renderGraph();
  }

  // tslint:disable-next-line member-access
  handleClickNode(nodeName: string) {
    const node = this.props.nodes.find(n => n.name === nodeName);
    if (node === undefined) {
      throw new Error('invalid node name is given: ' + nodeName);
    }
    this.props.onClickNode(node);
  }

  // tslint:disable-next-line member-access
  handleClickCluster(clusterName: string) {
    const cluster = this.props.clusters.find(n => n.name === clusterName);
    if (cluster === undefined) {
      throw new Error('invalid node name is given: ' + clusterName);
    }
    this.props.onClickCluster(cluster);
  }

  // tslint:disable-next-line member-access
  renderGraph() {
    // Create the input graph

    // Create the renderer
    const render = new dagreD3.render();
    // Set up an SVG group so that we can translate the final graph.
    const svg = d3
      .select(this.node)
      .attr('width', this.props.width)
      .attr('height', this.props.height);
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    const selector = svg.select('g');
    render(selector as any, this.g.toGraph());

    selector
      .selectAll('g.cluster')
      .on('click', (v: string) => this.handleClickCluster(v));

    selector
      .selectAll('g.node')
      .on('click', (v: string) => this.handleClickNode(v));

    // Center the graph
    const width = parseInt(svg.attr('width'), 10);
    const xCenterOffset = (width - this.g.toGraph().graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', this.g.toGraph().graph().height + 40);

    // Set up zoom support
    const onZoom = d3.zoom().on('zoom', () => {
      selector.attr('transform', getEvent().transform);
    });
    svg.call(onZoom);

    this.node = svg;
  }

  // tslint:disable-next-line member-access
  render() {
    return <svg ref={node => (this.node = node)} />;
  }
}

export default Dagre;
