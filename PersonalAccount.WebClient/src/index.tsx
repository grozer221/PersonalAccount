import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import enUS from 'antd/lib/locale/en_US';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {ApolloProvider} from '@apollo/client';
import {client} from './gql/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
          <Provider store={store}>
              <BrowserRouter>
                  <ConfigProvider locale={enUS}>
                      <App/>
                  </ConfigProvider>
              </BrowserRouter>
          </Provider>
      </ApolloProvider>
  </React.StrictMode>
);