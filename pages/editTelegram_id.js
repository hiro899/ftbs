import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';

function EditTelegramId() {
  const [telegramId, setTelegramId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const TELEGRAM_API_URL = "https://yqv6brqqbycxktr3k5napxocgq0coaqb.lambda-url.ap-northeast-1.on.aws";

  useEffect(() => {
    const fetchCurrentTelegramId = async () => {
      const userInfo = await Auth.currentUserInfo();
      setTelegramId(userInfo.attributes['custom:telegram_id'] || "");
    };
    
    fetchCurrentTelegramId();
  }, []);

  const updateTelegramId = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const userInfo = await Auth.currentUserInfo();
  
    const payload = {
      telegram_id: telegramId,
      user_id: userInfo.username
    };
  
    const res = await fetch(TELEGRAM_API_URL, {
      method: 'PUT',  // ここを PUT に変更
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });
  
    if (res.ok) {
      setSuccessMessage('ボットIDが正常に更新されました。');
    } else {
      const errorData = await res.json();
      setErrorMessage(errorData.message || 'ボットIDの更新に失敗しました。');
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <HeaderBar />
      <h1 className="text-4xl mb-6">ボットID 編集</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={updateTelegramId} className="w-full max-w-md">
        <div className="mb-4">
          ボットID
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="BotFatherから取得したボットIDを入力"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
        </div>
        <div>
          {isLoading ? (
            <div>送信中...</div>
          ) : (
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              更新
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default withProtectedRoute(EditTelegramId);
