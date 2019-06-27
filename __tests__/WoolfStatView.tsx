import { shallow } from 'enzyme';
import { WoolfStatView } from '../src/components/WoolfStatView';
import * as React from 'react';
import { IJobStat } from 'woolf';
import { JobState } from 'woolf/src/scheduler/scheduler';
import { JobFuncStat, JobFuncState } from 'woolf/src/job';
import Table from '@material-ui/core/Table';

describe('WoolfStatView', () => {
  it('has Paper', async () => {
    const jobStat: IJobStat = {
      environment: 'pending',
      fromJobIDs: [],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: JobFuncState.Ready
        } as JobFuncStat
      ],
      id: 0,
      isStartJob: true,
      isTerminusJob: false,
      name: 'some-job',
      state: JobState.Ready,
      toJobIDs: [1]
    };
    const woolfStatView = <WoolfStatView jobStat={jobStat} funcStat={null} />;
    const wrapper = shallow(woolfStatView);
    expect(wrapper.find(Table)).toHaveLength(1);
  });
});
