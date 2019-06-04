import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import { WoolfStatView } from '../src/components/WoolfStatView';
import { WoolfView } from '../src/components/WoolfView';
import {
  funcStat,
  jobStat,
  jobStatForWoolfStatViewFunctionSelected,
  stats
} from './data';

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
    return (
      <WoolfStatView
        jobStat={jobStatForWoolfStatViewFunctionSelected}
        funcStat={funcStat}
        onClickCode={action('onClickCode')}
      />
    );
  })
  .add('job selected', () => {
    return (
      <WoolfStatView
        jobStat={jobStat}
        onClickCode={action('onClickCode')}
        funcStat={null}
      />
    );
  });

storiesOf('WoolfView', module).add('Processing', () => {
  return (
    <WoolfView
      height={600}
      onClickFuncNode={action('onClickFuncNode')}
      onClickJobNode={action('onClickJobNode')}
      stats={stats}
      width={600}
    />
  );
});
