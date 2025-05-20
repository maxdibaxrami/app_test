import ReactDOM from 'react-dom/client';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';
import './index.css';
import telegramAnalytics from '@telegram-apps/analytics';
import './mockEnv.ts';
import { Provider } from 'react-redux';
import { store } from './store.ts';

telegramAnalytics.init({
  token: 'eyJhcHBfbmFtZSI6ImZhc2VfbWF0Y2hfYm90IiwiYXBwX3VybCI6Imh0dHBzOi8vdC5tZS9mYXNlX21hdGNoX2JvdCIsImFwcF9kb21haW4iOiJodHRwczovL2FwcC10ZXN0LW9tZWdhLnZlcmNlbC5hcHAvIn0=!QC07rQlVq8NcBKPJeC6uM/OOBcAoZd30o09AiD7Bixg=', // SDK Auth token received via @DataChief_bot
  appName: 'fase_match_bot', // The analytics identifier you entered in @DataChief_bot
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  // Configure all application dependencies.
  init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);

  root.render(
        <Provider store={store}>
          <Root/>
        </Provider>
  );
} catch (e) {
  root.render(<EnvUnsupported/>);
}
