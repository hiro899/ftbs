import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Signup() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async (event) => {
    event.preventDefault();

    // Telegram IDが半角文字のみかチェック
    if (!/^[\x20-\x7E]*$/.test(telegramId)) {
        alert('ボットIDは半角文字のみで入力してください。');
        return;
    }


    if (password !== confirmPassword) {
      alert('パスワードと確認用パスワードが一致しません。');
      return;
    }

    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          'custom:telegram_id': telegramId,
        },
      });

      sessionStorage.setItem('email', email);

      router.push('/verifyCode'); // ユーザー確認ページへリダイレクト
    } catch (error) {
      console.log('新規登録エラー', error);
      alert('情報を正しく入力してください');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">新規登録</h1>
      <p className="mb-4">まず
      <a href="https://far-fluorine-09d.notion.site/0662c0efcdce4e77886974fe25c8e105" 
       className="text-blue-500 hover:text-blue-400 transition-colors duration-200" 
       target="_blank" 
       rel="noopener noreferrer">使い方</a>をお読みください</p>
      <form className="w-64 space-y-4" onSubmit={handleSignup}>
        <label className="flex flex-col">
          ボットID
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="telegramId"
            type="text"
            placeholder="Botfatherから取得"
            onChange={(e) => setTelegramId(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          メールアドレス
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="email"
            type="email"
            placeholder="例：xxx@xmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          パスワード（8文字以上）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="パスワードを入力"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          パスワード確認
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
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
          新規登録
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/login">
          <a className="text-blue-500 hover:text-blue-400 transition-colors duration-200">すでにアカウントをお持ちの方</a>
        </Link>
      </div>
    </div>
  );
}
