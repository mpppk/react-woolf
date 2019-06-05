import * as React from 'react';
import MonacoEditor from './Monaco';

export interface FunctionEditorProps {
  language: 'javascript' | 'json'; // FIXME
  value: string;
  theme: 'vs-dark'; // FIXME
}

export const FunctionEditor = (props: FunctionEditorProps) => {
  const nullHandler = () => null;

  const options = {
    automaticLayout: false,
    cursorStyle: 'line',
    readOnly: false,
    roundedSelection: false,
    selectOnLineNumbers: true
  };

  return (
    <MonacoEditor
      width={500}
      height={200}
      language={props.language}
      theme={props.theme}
      value={props.value}
      options={options}
      onChange={nullHandler}
      editorDidMount={nullHandler}
      editorWillMount={nullHandler}
    />
  );
};
