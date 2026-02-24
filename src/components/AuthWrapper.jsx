import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = ({ onLogin, onBack }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = (userData) => {
        onLogin(userData);
    };

    const handleRegister = (userData) => {
        onLogin(userData);
    };

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return isLogin ? (
        <Login
            onLogin={handleLogin}
            onBack={onBack}
            onSwitchToRegister={switchToRegister}
        />
    ) : (
        <Register
            onRegister={handleRegister}
            onBack={onBack}
            onSwitchToLogin={switchToLogin}
        />
    );
};

export default Auth;
