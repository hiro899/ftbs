import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';
import { useRouter } from 'next/router';

function NewCharacterForm() {
  const [characterData, setCharacterData] = useState({
    character_name: "",
    system_message: "",
    telegram_token: "",
    payment_token: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();

  const CHARACTER_API_URL = "https://c5n7gj2aqqzp52bszbrnnpezqe0vpyvo.lambda-url.ap-northeast-1.on.aws/";

  const createCharacterData = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInfo = await Auth.currentUserInfo();
    const telegramId = userInfo.attributes['custom:telegram_id'];

    const payload = {
      ...characterData,
      telegram_id: telegramId,
      http_method: 'POST',
    };

    const res = await fetch(CHARACTER_API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
        setSuccessMessage('キャラクターが正常に登録されました。');
        router.push('/character');
      } else {
        const errorData = await res.json();  // エラーレスポンスを取得
        setErrorMessage(errorData.message || 'キャラクターの登録に失敗しました。');
      }

    setIsLoading(false);
  };

  const handleInputChange = (field, event) => {
    setCharacterData({
      ...characterData,
      [field]: event.target.value
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <HeaderBar />
      <h1 className="text-4xl mb-6">ボット新規登録</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={createCharacterData} className="w-full max-w-md">
        <div className="mb-4">
            キャラクター名（変更可）
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="例：テレ子"
            value={characterData.character_name}
            onChange={(e) => handleInputChange('character_name', e)}
          />
        </div>
        <div>
          {isLoading ? (
            <div>送信中...</div>
          ) : (
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              詳細設定へ
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default withProtectedRoute(NewCharacterForm);
