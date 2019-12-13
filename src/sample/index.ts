import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SampleApp } from './SampleApp';

const ReactElement = React.createElement(SampleApp);
ReactDOM.render(ReactElement, document.getElementById('root'));
