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
      router.push('/');
    } catch (error) {
      console.log('ログインエラー', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-10" style={{color: '#775541'}}>FTBS</h1>
      <form className="w-64 space-y-4" onSubmit={handleSignIn}>
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
          Password
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type="password"
            name="password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          type="submit"
        >
          Login
        </button>
      </form>
      <div className="flex flex-col space-y-4 mt-4">
        <Link href="/signup">
        <a className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}>新しくアカウントを作成</a>
        </Link>
        <Link href="/forgotPassword">
        <a className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}>パスワードをお忘れの方</a>
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
