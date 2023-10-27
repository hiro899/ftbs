import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ResetPassword() {
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-10">パスワードを更新</h1>
      <form className="w-64 space-y-4" onSubmit={handleResetPassword}>
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
        <label className="flex flex-col">
          新パスワード（８文字以上）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="新しいパスワードを入力"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          新パスワード確認
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="パスワードを再入力"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <label className="flex items-center mt-2">
          <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
          <span className="ml-2">表示</span>
        </label>
        <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200" 
          type="submit"
        >
          パスワードを更新
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
