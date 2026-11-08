import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/fonts.css';
import './styles/globals.css';
import './styles/ui.css';
import './styles/component-overrides.css';
import './styles/design-overrides.css';
// Настройки читаемости подключаются последними, не меняя базовый дизайн.
import './styles/accessibility.css';
import './styles/background.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
