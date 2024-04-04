import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SampleApp } from './SampleApp';

const container = document.getElementById('root');
createRoot(container!).render(React.createElement(SampleApp));
