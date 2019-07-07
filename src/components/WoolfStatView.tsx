import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { FunctionComponent } from 'react';
import * as React from 'react';
import { IJobStat } from 'woolf';
// import { JobFuncStat } from '../woolf/src/job';
import { JobFuncStat } from 'woolf/src/job';
import JSONTree from 'react-json-tree';

interface IWoolfStatProps {
  jobStat: IJobStat;
  funcStat: JobFuncStat;
}

const to2ColumnTableRow = (col1: string, col2: string) => {
  return (
    <TableRow>
      <TableCell scope="row">{col1}</TableCell>
      <TableCell scope="row">{col2}</TableCell>
    </TableRow>
  );
};

const to2ColumnTableJsonRow = (col1: string, obj: object) => {
  return (
    <TableRow>
      <TableCell scope="row">{col1}</TableCell>
      <TableCell scope="row">
        <JSONTree data={obj} />
      </TableCell>
    </TableRow>
  );
};

const jobStatToJobNameRow = (jobStat: IJobStat) => {
  const jobName = jobStat && jobStat.name ? jobStat.name : '-';
  return to2ColumnTableRow('Job Name', jobName);
};

const jobStatToJobStateRow = (jobStat: IJobStat) => {
  const jobState = jobStat && jobStat.state ? jobStat.state : '-';
  return to2ColumnTableRow('Job State', jobState);
};

const funcStatToFunctionNameRow = (funcStat?: JobFuncStat) => {
  const functionName =
    funcStat && funcStat.FunctionName ? funcStat.FunctionName : '-';
  return to2ColumnTableRow('Function Name', functionName);
};

const funcStatToFunctionStateRow = (funcStat?: JobFuncStat) => {
  const functionState = funcStat && funcStat.state ? funcStat.state : '-';
  return to2ColumnTableRow('Function State', functionState);
};

const funcStatToFunctionInputPathRow = (funcStat?: JobFuncStat) => {
  const inputPath = funcStat && funcStat.InputPath ? funcStat.InputPath : '-';
  return to2ColumnTableRow('InputPath', inputPath);
};

const funcStatToFunctionOutputPathRow = (funcStat?: JobFuncStat) => {
  const outputPath =
    funcStat && funcStat.OutputPath ? funcStat.OutputPath : '-';
  return to2ColumnTableRow('OutputPath', outputPath);
};

const funcStatToFunctionResultPathRow = (funcStat?: JobFuncStat) => {
  const resultPath =
    funcStat && funcStat.ResultPath ? funcStat.ResultPath : '-';
  return to2ColumnTableRow('ResultPath', resultPath);
};

const jobStatToPayloadRow = (jobStat?: IJobStat) => {
  const event = jobStat && jobStat.payload ? jobStat.payload : {};
  return to2ColumnTableJsonRow('Job Event', event);
};

const jobStatToResultsRow = (jobStat?: IJobStat) => {
  const results = jobStat && jobStat.results ? jobStat.results : {};
  return to2ColumnTableJsonRow('Job Results', results);
};

const funcStatToEventRow = (funcStat?: JobFuncStat) => {
  const event = funcStat && funcStat.event ? funcStat.event : {};
  return to2ColumnTableJsonRow('Function Event', event);
};

const funcStatToResultsRow = (funcStat?: JobFuncStat) => {
  const results = funcStat && funcStat.results ? funcStat.results : {};
  return to2ColumnTableJsonRow('Function Results', results);
};

const funcStatToFunctionParameterRow = (funcStat?: JobFuncStat) => {
  const parameter = funcStat && funcStat.Parameters ? funcStat.Parameters : {};
  return to2ColumnTableJsonRow('Parameters', parameter);
};

// tslint:disable-next-line variable-name
export const WoolfStatView: FunctionComponent<IWoolfStatProps> = props => {
  return (
    <Paper>
      <Table>
        <TableBody>
          {jobStatToJobNameRow(props.jobStat)}
          {jobStatToJobStateRow(props.jobStat)}
          {funcStatToFunctionNameRow(props.funcStat)}
          {funcStatToFunctionStateRow(props.funcStat)}
          {funcStatToFunctionInputPathRow(props.funcStat)}
          {funcStatToFunctionOutputPathRow(props.funcStat)}
          {funcStatToFunctionResultPathRow(props.funcStat)}
          {jobStatToPayloadRow(props.jobStat)}
          {jobStatToResultsRow(props.jobStat)}
          {funcStatToFunctionParameterRow(props.funcStat)}
          {funcStatToEventRow(props.funcStat)}
          {funcStatToResultsRow(props.funcStat)}
        </TableBody>
      </Table>
    </Paper>
  );
};
