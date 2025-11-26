import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SampleApp } from './SampleApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SampleApp />
  </StrictMode>,
);
