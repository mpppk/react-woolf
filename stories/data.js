export const jobStat = {
  environment: 'pending',
  event: { count: 0 },
  results: { count: 2 },
  fromJobIDs: [],
  funcs: [
    {
      FunctionName: 'test-func01',
      state: 'DONE'
    }
  ],
  id: 0,
  isStartJob: true,
  isTerminusJob: false,
  name: 'some-job',
  state: 'DONE',
  toJobIDs: [1]
};

export const funcStat = {
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
  state: 'DONE',
  event: { count: 0 },
  results: { count: 2 }
};

export const stats = [
  {
    environment: 'local',
    event: { count: 0 },
    results: { count: 2 },
    fromJobIDs: [],
    funcs: [
      {
        FunctionName: 'some-func01',
        state: 'DONE'
      }
    ],
    id: 0,
    isStartJob: true,
    isTerminusJob: false,
    name: 'some-job',
    state: 'DONE',
    toJobIDs: [1, 2]
  },
  {
    environment: 'aws',
    fromJobIDs: [0],
    funcs: [
      {
        event: { count: 0 },
        results: { count: 2 },
        FunctionName: 'aws-func01',
        state: 'PROCESSING'
      },
      {
        event: { count: 0 },
        results: { count: 2 },
        FunctionName: 'aws-func02',
        state: 'READY'
      }
    ],
    id: 1,
    isStartJob: false,
    isTerminusJob: false,
    name: 'aws-job',
    state: 'READY',
    toJobIDs: [3]
  },
  {
    environment: 'local',
    event: { count: 0 },
    results: { count: 2 },
    fromJobIDs: [0],
    funcs: [
      {
        event: { count: 0 },
        results: { count: 2 },
        FunctionName: 'local-func01',
        state: 'PROCESSING'
      }
    ],
    id: 2,
    isStartJob: false,
    isTerminusJob: false,
    name: 'local-job',
    state: 'PROCESSING',
    toJobIDs: [3]
  },
  {
    environment: 'pending',
    event: { count: 0 },
    results: { count: 2 },
    fromJobIDs: [1, 2],
    funcs: [
      {
        event: { count: 0 },
        results: { count: 2 },
        FunctionName: 'another-func01',
        state: 'READY'
      }
    ],
    id: 3,
    isStartJob: false,
    isTerminusJob: true,
    name: 'another-job',
    state: 'READY',
    toJobIDs: []
  }
];

export const jobStatForWoolfStatViewFunctionSelected = {
  environment: 'local',
  event: { count: 0 },
  results: { count: 1 },
  fromJobIDs: [],
  funcs: [
    {
      event: { count: 0 },
      results: { count: 1 },
      FunctionName: 'some-func01',
      state: 'DONE'
    }
  ],
  id: 0,
  isStartJob: true,
  isTerminusJob: false,
  name: 'some-job',
  state: 'DONE',
  toJobIDs: [1]
};
