import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!/^\d+$/.test(code)) {
        alert('確認コードを正しく入力してください。');
        return;
      }

    if (password !== confirmPassword) {
      alert('パスワードと確認用パスワードが一致しません。');
      return;
    }

    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      alert('パスワードは正常にリセットされました。');
      router.push('/login'); // ログインページへリダイレクト
    } catch (error) {
      console.log('パスワードリセットエラー', error);
      alert('情報を正しく入力してください');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-10" style={{color: '#775541'}}>Reset Password</h1>
      <form className="w-64 space-y-4" onSubmit={handleResetPassword}>
        <label className="flex flex-col" style={{color: '#775541'}}>
          Verification Code
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="code"
            type="text"
            placeholder=""
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <label className="flex flex-col" style={{color: '#775541'}}>
        Email
        <input
          className="px-3 py-2 border border-gray-300 rounded"
          name="email"
          type="email"
          placeholder=""
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
        <label className="flex flex-col" style={{color: '#775541'}}>
          New Password（８文字以上）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col" style={{color: '#775541'}}>
        New Password（確認）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder=""
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <label className="flex items-center mt-2">
          <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
          <span className="ml-2" style={{color: '#775541'}}>表示</span>
        </label>
        <button 
          className="w-full px-3 py-2 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          type="submit"
        >
          Reset Password
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/login">
        <a className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}>ログインページに戻る</a>
        </Link>
      </div>
    </div>
  );
}
