import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeaderBar from '../components/HeaderBar';

export default function VerifyEmailChange() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    if (!/^\d+$/.test(code)) {
      alert('確認コードを正しく入力してください。');
      return;
    }

    try {
      // AWS Amplifyの関数を使用して、新しいメールアドレスを確定
      await Auth.verifyCurrentUserAttributeSubmit('email', code);
      alert('メールアドレスは正常に変更されました。');
      router.push('/login'); 
    } catch (error) {
      console.log('メールアドレス変更確認エラー', error);
      alert('情報を正しく入力してください');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <HeaderBar />
      <h1 className="text-4xl mb-10">メールアドレス変更の確認</h1>
      <form className="w-64 space-y-4" onSubmit={handleVerifyEmail}>
        <label className="flex flex-col">
          確認コード
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="code"
            type="text"
            placeholder="コードを入力"
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200" 
          type="submit"
        >
          メールアドレスを更新
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
