import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Signup() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async (event) => {
    event.preventDefault();

    // Usernameが半角文字のみかチェック
    if (!/^[\x20-\x7E]*$/.test(username)) {
      alert('ユーザー名は半角文字のみ');
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
          'custom:username': username,
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-4" style={{color: '#775541'}}>Sign up</h1>
      <form className="w-64 space-y-4" onSubmit={handleSignup}>
      <label className="flex flex-col">
        User Name
        <input
          className="px-3 py-2 border border-gray-300 rounded"
          name="username"
          type="text"
          placeholder=""
          onChange={(e) => setUserName(e.target.value)}
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
          Password（8文字以上）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="flex flex-col" style={{color: '#775541'}}>
        Password（確認）
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
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
          Sign up
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/login">
        <a className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}>すでにアカウントをお持ちの方</a>
        </Link>
      </div>
    </div>
  );
}
