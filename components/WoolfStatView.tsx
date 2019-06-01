import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { FunctionComponent } from 'react';
import { IJobStat } from 'woolf';
import { JobFuncStat } from 'woolf/src/job';
import ReactJson from 'react-json-view';

interface IWoolfStatProps {
  jobStat: IJobStat;
  funcStat: JobFuncStat;
  onClickCode: (func: (...args) => any) => void;
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
        <ReactJson src={obj} />
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

const funcStatToFunctionParameterRow = (funcStat?: JobFuncStat) => {
  const parameter = funcStat && funcStat.Parameters ? funcStat.Parameters : {};
  return to2ColumnTableJsonRow('Parameters', parameter);
};

// tslint:disable-next-line variable-name
export const WoolfStatView: FunctionComponent<IWoolfStatProps> = props => {
  const handleClick = () => {
    // FIXME
    const dummyHandler = () => console.log('hello');
    props.onClickCode(dummyHandler);
  };

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
          {funcStatToFunctionParameterRow(props.funcStat)}
          <TableRow>
            <TableCell scope="row">Code</TableCell>
            <TableCell scope="row">
              <Button onClick={handleClick}>Open</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
