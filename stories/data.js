export const jobStat = {
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

export const jobStatForWoolfStatViewFunctionSelected = {
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
