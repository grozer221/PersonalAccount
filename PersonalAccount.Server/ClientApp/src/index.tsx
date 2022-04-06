import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import ukUA from 'antd/lib/locale/uk_UA';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {ApolloProvider} from '@apollo/client';
import {client} from './gql/client';

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Provider store={store}>
                <BrowserRouter>
                    <ConfigProvider locale={ukUA}>
                        <App/>
                    </ConfigProvider>
                </BrowserRouter>
            </Provider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root'));
