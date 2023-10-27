import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';

function VerifyCodePage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('email');
    if (sessionEmail) {
      setEmail(sessionEmail);
    } else {
      router.push('/signup');
    }
  }, []);

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      await Auth.confirmSignUp(email, code);
      router.push('/login');
    } catch (error) {
      console.log('確認コードの入力中にエラーが発生しました', error);
    }
  }

  const handleResendCode = async () => {
    try {
      await Auth.resendSignUp(email);
      alert('確認コードを再送信しました。');
    } catch (error) {
      console.log('確認コードの再送信中にエラーが発生しました', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-10">確認コードの入力</h1>
      <form className="w-64 space-y-4" onSubmit={handleVerification}>
        <label className="flex flex-col">
          確認コード:
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type="text"
            placeholder="確認コードを入力"
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200" 
          type="submit"
        >
          確認
        </button>
      </form>
      <p
        className="text-blue-500 cursor-pointer mt-4"
        onClick={handleResendCode}
      >
        コードを再送信
      </p>
    </div>
  );
}

export default VerifyCodePage;
