import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { WoolfStatView } from '../src/components/WoolfStatView';
import { WoolfView } from '../src/components/WoolfView';
import {
  funcStat,
  jobStat,
  jobStatForWoolfStatViewFunctionSelected,
  stats
} from './data';

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
