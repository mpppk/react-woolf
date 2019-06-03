import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import { WoolfStatView } from '../src/components/WoolfStatView';
import { WoolfView } from '../src/components/WoolfView';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with text2', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf('WoolfStatView', module)
  .add('function selected', () => {
    const jobStat = {
      fromJobIDs: [],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'DONE'
        }
      ],
      id: 0,
      name: 'some-job',
      state: 'DONE',
      toJobIDs: [1]
    };
    const funcStat = {
      Handler: 'index.handler',
      InputPath: '$',
      OutputPath: '$',
      Parameters: {
        foo: 'some string',
        bar: 1
      },
      ResultPath: '$',
      Role: '-',
      Runtime: 'nodejs8.10',
      FunctionName: 'test-func01',
      state: 'DONE'
    };
    return (
      <WoolfStatView
        jobStat={jobStat}
        funcStat={funcStat}
        onClickCode={() => {}}
      />
    );
  })
  .add('job selected', () => {
    const jobStat = {
      fromJobIDs: [],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'DONE'
        }
      ],
      id: 0,
      name: 'some-job',
      state: 'DONE',
      toJobIDs: [1]
    };
    return (
      <WoolfStatView jobStat={jobStat} onClickCode={() => {}} funcStat={null} />
    );
  });

storiesOf('WoolfView', module).add('Processing', () => {
  const stats = [
    {
      fromJobIDs: [],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'DONE'
        }
      ],
      id: 0,
      name: 'some-job',
      state: 'DONE',
      toJobIDs: [1]
    },
    {
      fromJobIDs: [0],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'PROCESSING'
        },
        {
          FunctionName: 'test-func06',
          state: 'READY'
        }
      ],
      id: 1,
      name: 'another-job',
      state: 'READY',
      toJobIDs: [2, 3]
    },
    {
      fromJobIDs: [1],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'READY'
        }
      ],
      id: 2,
      name: 'suspend-job',
      state: 'SUSPEND',
      toJobIDs: []
    },
    {
      fromJobIDs: [2],
      funcs: [
        {
          FunctionName: 'test-func01',
          state: 'READY'
        }
      ],
      id: 3,
      name: 'suspend-job2',
      state: 'SUSPEND',
      toJobIDs: []
    }
  ];
  return (
    <WoolfView
      height={600}
      onClickFuncNode={() => {}}
      onClickJobNode={() => {}}
      stats={stats}
      width={600}
    />
  );
});
