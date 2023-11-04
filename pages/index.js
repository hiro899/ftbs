import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import HeaderBar from '../components/HeaderBar';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import withProtectedRoute from '../hoc/withProtectedRoute';

function HomePage () {

  const router = useRouter();

  // ログアウト関数
  const handleLogout = async () => {
    try {
      await Auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2"  style={{backgroundColor: '#f0ecec'}}>
      <h1 className="text-4xl mb-10" style={{color: '#775541'}}>High Brand Business</h1>
      <div className="flex flex-col space-y-4">
        <Link href="https://drive.google.com/drive/folders/13hbJ9t-yDKKeZczjswbpsxj1lzmHEwTB?usp=drive_link">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
          卸リスト
          </a>
        </Link>
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLScI9wUcWgwo-cH5UcmcSUTGeCerEqm30yIykRDWNpXOSJQuxA/viewform">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
            オーダーフォーム
          </a>
        </Link>
        <Link href="https://docs.google.com/forms/d/1u0deLkB3tYzhXu5TM-Xy-8PitHQ1SyPTXTBRyk0lE6Q/viewform?edit_requested=true">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
            卸条件確認
          </a>
        </Link>
        <Link href="https://docs.google.com/forms/d/1_Yw-0_qZ5X9UDXlW8AtdnxO0qXDzZZeosW6sAqWYas4/viewform?edit_requested=true">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
            お問い合わせ
          </a>
        </Link>
        <Link href="https://docs.google.com/presentation/d/1tFmLvUjpLyC--YIPr1M6jqhM6AuR3S_IQuW9-CDzziE/edit#slide=id.g296526db04c_0_195">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
            卸サイトの使い方
          </a>
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-[#775541] border border-[#775541] hover:text-white hover:bg-[#59382D] transition-colors duration-200 px-3 py-2 rounded"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default withProtectedRoute(HomePage);
