import { useState } from 'react';
import LoginPage from './LoginPage';
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      {isLogin ? (
        <div>
          <LoginPage />
          <button onClick={() => setIsLogin(false)}>Créer un compte</button>
        </div>
      ) : (
        <div>
          <Register />
          <button onClick={() => setIsLogin(true)}>Déjà un compte ?</button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;