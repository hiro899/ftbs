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
    <div className="flex flex-col items-center justify-center min-h-screen py-2" style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-10" style={{color: '#775541'}}>Verification Code</h1>
      <form className="w-64 space-y-4" onSubmit={handleVerification}>
        <label className="flex flex-col" style={{color: '#775541'}}>
          <input
            className="px-3 py-2 border border-gray-300 rounded"
            type="text"
            placeholder=""
            onChange={(e) => setCode(e.target.value)}
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
        <p
          className="transition-colors duration-200" style={{color: '#775541', hover: {color: '#89665c'}}}
          onClick={handleResendCode}
        >
          コードを再送信
        </p>
      </div>
    </div>
  );
}

export default VerifyCodePage;
