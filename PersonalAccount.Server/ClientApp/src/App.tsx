import React from 'react';
import {Route, Routes} from 'react-router-dom';
import 'antd/dist/antd.css';
import './App.css';
import {TLoginButton, TLoginButtonSize} from 'react-telegram-auth';

export const App = () => {
    return (
        <Routes>
            <Route path="login" element={<>login</>}/>
            <Route path="admin/*" element={<>admin</>}/>
            <Route path="/*" element={
                <>
                    <h1>client</h1>
                    <TLoginButton
                        botName="ZTUPersonalAccountBot"
                        buttonSize={TLoginButtonSize.Large}
                        lang="en"
                        usePic={false}
                        cornerRadius={20}
                        onAuthCallback={(user) => {
                            console.log('Hello, user!', user);
                            const a = user.id
                        }}
                        requestAccess={'write'}
                    />
                </>
            }/>
        </Routes>
    );
};
