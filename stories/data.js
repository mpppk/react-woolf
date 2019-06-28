export const jobStat = {
  environment: 'pending',
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
  state: 'DONE'
};

export const stats = [
  {
    environment: 'local',
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
        FunctionName: 'aws-func01',
        state: 'PROCESSING'
      },
      {
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
    fromJobIDs: [0],
    funcs: [
      {
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
    fromJobIDs: [1, 2],
    funcs: [
      {
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
  toJobIDs: [1]
};
