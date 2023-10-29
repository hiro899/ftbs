import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      await Auth.forgotPassword(email);
      sessionStorage.setItem('email', email);
      router.push('/resetPassword'); // パスワードリセット確認ページへリダイレクト
    } catch (error) {
      console.log('パスワードリセット要求エラー', error);
      alert('正しくメールアドレスを入力してください');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-10"  style={{color: '#775541'}}>Password Reset</h1>
      <form className="w-64 space-y-4" onSubmit={handleResetPassword}>
        <label className="flex flex-col"  style={{color: '#775541'}}>
          Email
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="email"
            type="email"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          type="submit"
        >
          送信
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/login">
        <a className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}>ログインに戻る</a>
        </Link>
      </div>
    </div>
  );
}
