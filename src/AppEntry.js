import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';
import FeatureFlagProvider from './FeatureFlags/Provider';
import QueryParamsProvider from './QueryParams/Provider';

const AutomationAnalytics = () => (
  <Provider store={init().getStore()}>
    <FeatureFlagProvider>
      <Router basename={getBaseName()}>
        <QueryParamsProvider>
          <App />
        </QueryParamsProvider>
      </Router>
    </FeatureFlagProvider>
  </Provider>
);

export default AutomationAnalytics;
