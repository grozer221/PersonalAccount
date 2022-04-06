import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {BrowserRouter} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import ukUA from 'antd/lib/locale/uk_UA';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider locale={ukUA}>
                <App/>
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'));
