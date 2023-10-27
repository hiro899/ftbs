import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import Link from 'next/link';
import { useRouter } from 'next/router';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      router.push('/character'); // ログイン成功時にボット設定へリダイレクト
    } catch (error) {
      console.log('ログインエラー', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-10">Login</h1>
      <form className="w-64 space-y-4" onSubmit={handleSignIn}>
        <label className="flex flex-col">
          メール
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            name="email"
            type="email"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          パスワード
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type="password"
            name="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200" 
          type="submit"
        >
          login
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/signup">
          <a className="text-blue-500 hover:text-blue-400 transition-colors duration-200">新しくアカウントを作成</a>
        </Link>
        <Link href="/forgotPassword">
          <a className="text-blue-500 hover:text-blue-400 transition-colors duration-200">パスワードを忘れた方</a>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
