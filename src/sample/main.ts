import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SampleApp } from './SampleApp';

const container = document.getElementById('root');
const root = createRoot(container!);
const element = React.createElement(SampleApp);
root.render(element as any);
