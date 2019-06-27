import { shallow } from 'enzyme';
import * as React from 'react';
import { WoolfView } from '../src/components/WoolfView';
import { IJobStat } from 'woolf';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import { JobState } from 'woolf/src/scheduler/scheduler';
import Dagre from '../src/components/Dagre';

const stats: IJobStat[] = [
  {
    environment: 'local',
    fromJobIDs: [],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Done
      } as JobFuncStat
    ],
    id: 0,
    isStartJob: true,
    isTerminusJob: false,
    name: 'some-job',
    state: JobState.Done,
    toJobIDs: [1]
  },
  {
    environment: 'local',
    fromJobIDs: [0],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Processing
      } as JobFuncStat,
      {
        FunctionName: 'test-func06',
        state: JobFuncState.Ready
      } as JobFuncStat
    ],
    id: 1,
    isStartJob: false,
    isTerminusJob: false,
    name: 'another-job',
    state: JobState.Ready,
    toJobIDs: [2, 3]
  },
  {
    environment: 'pending',
    fromJobIDs: [1],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Ready
      } as JobFuncStat
    ],
    id: 2,
    isStartJob: false,
    isTerminusJob: true,
    name: 'suspend-job',
    state: JobState.Suspend,
    toJobIDs: []
  },
  {
    environment: 'pending',
    fromJobIDs: [2],
    funcs: [
      {
        FunctionName: 'test-func01',
        state: JobFuncState.Ready
      } as JobFuncStat
    ],
    id: 3,
    isStartJob: false,
    isTerminusJob: true,
    name: 'suspend-job2',
    state: JobState.Suspend,
    toJobIDs: []
  }
];

describe('WoolfView', () => {
  it('has Dagre', async () => {
    const woolfView = (
      <WoolfView
        height={600}
        onClickFuncNode={() => {}}
        onClickJobNode={() => {}}
        stats={stats}
        showInput={true}
        showOutput={true}
        width={600}
      />
    );
    const wrapper = shallow(woolfView);
    expect(wrapper.find(Dagre)).toHaveLength(1);
  });
});
