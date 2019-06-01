// fork from https://github.com/react-monaco-editor/react-monaco-editor/blob/master/src/editor.js
(window as any).MonacoEnvironment = {
  ...(window as any).MonacoEnvironment,
  baseUrl: '/static'
};
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Component } from 'react';

interface MonacoProps {
  value: string;
  language: 'javascript' | 'json'; // FIXME
  theme: string;
  width: number;
  height: number;
  options: editor.IEditorOptions;
  onChange: (...args: any) => void; // FIXME
  editorWillMount: (...args: any) => any; // FIXME
  editorDidMount: (...args: any) => any; // FIXME
}

export default class MonacoEditor extends Component<MonacoProps> {
  private __current_value: string; // tslint:disable-line variable-name
  private containerElement: any; // FIXME
  private editor: editor.IStandaloneCodeEditor;
  private __prevent_trigger_change_event: boolean; // tslint:disable-line variable-name

  constructor(props) {
    super(props);
    this.containerElement = undefined;
    this.__current_value = props.value;
  }

  // tslint:disable-next-line member-access
  componentDidMount() {
    this.initMonaco();
  }

  // tslint:disable-next-line member-access
  componentDidUpdate(prevProps) {
    if (this.props.value !== this.__current_value) {
      // Always refer to the latest value
      this.__current_value = this.props.value;
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true;
        this.editor.setValue(this.__current_value);
        this.__prevent_trigger_change_event = false;
      }
    }
    if (prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(
        this.editor.getModel(),
        this.props.language
      );
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme);
    }
    if (
      this.editor &&
      (this.props.width !== prevProps.width ||
        this.props.height !== prevProps.height)
    ) {
      this.editor.layout();
    }
    if (prevProps.options !== this.props.options) {
      this.editor.updateOptions(this.props.options);
    }
  }

  // tslint:disable-next-line member-access
  componentWillUnmount() {
    this.destroyMonaco();
  }

  // tslint:disable-next-line member-access
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }

  // tslint:disable-next-line member-access
  initMonaco() {
    const value = this.props.value !== null ? this.props.value : '';
    const { language, theme, options } = this.props;
    if (this.containerElement) {
      // Before initializing monaco editor
      Object.assign(options, this.editorWillMount());
      this.editor = monaco.editor.create(this.containerElement, {
        language,
        value,
        ...options
      });
      this.setLanguage(language);
      if (theme) {
        monaco.editor.setTheme(theme);
      }
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
  }

  // tslint:disable-next-line member-access
  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    return options || {};
  }

  // tslint:disable-next-line member-access
  editorDidMount(mountedEditor) {
    this.props.editorDidMount(mountedEditor, monaco);
    mountedEditor.onDidChangeModelContent(event => {
      const value = mountedEditor.getValue();

      // Always refer to the latest value
      this.__current_value = value;

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event);
      }
    });
  }

  // tslint:disable-next-line member-access
  render() {
    const { width, height } = this.props;
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    const style = {
      height: fixedHeight,
      width: fixedWidth
    };

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }

  private assignRef = component => {
    this.containerElement = component;
  };

  private setLanguage(language: string) {
    const model = this.editor.getModel();
    editor.setModelLanguage(model, language);
  }
}

const processSize = size => (!/^\d+$/.test(size) ? size : `${size}px`);
