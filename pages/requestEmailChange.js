import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function RequestEmailChange() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const router = useRouter();

  // 一度ログイン情報からメールアドレスを取得して、表示する
  useEffect(() => {
    async function fetchCurrentUserEmail() {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setCurrentEmail(currentUser.attributes.email);
      } catch (error) {
        console.log('Error fetching current user', error);
      }
    }
    fetchCurrentUserEmail();
  }, []);

  const handleEmailChangeRequest = async (event) => {
    event.preventDefault();

    try {
      await Auth.updateUserAttributes({ email: newEmail });
      sessionStorage.setItem('newEmail', newEmail);
      router.push('/verifyEmailChange');
    } catch (error) {
      console.log('メールアドレス変更要求エラー', error);
      alert('正しくメールアドレスを入力してください');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-10">メールアドレスの変更</h1>
      <p className="mb-4">現在のメールアドレス: {currentEmail}</p>
      <form className="w-64 space-y-4" onSubmit={handleEmailChangeRequest}>
        <label className="flex flex-col">
          新しいメールアドレス
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="newEmail"
            type="email"
            placeholder="新しいメールアドレスを入力"
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200" 
          type="submit"
        >
          確認コードを送信
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/login">
          <a className="text-blue-500 hover:text-blue-400 transition-colors duration-200">ログインページに戻る</a>
        </Link>
      </div>
    </div>
  );
}
