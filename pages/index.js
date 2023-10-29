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
      <h1 className="text-4xl mb-10" style={{color: '#775541'}}>FTBS</h1>
      <div className="flex flex-col space-y-4">
        <Link href="https://drive.google.com/drive/folders/1h9-8zQOR9Yt3ys2h7cPOuMXCD0eFdqqw?usp=sharing">
          <a
            className="w-64 text-center block px-10 py-3 text-white rounded transition-colors duration-200 bg-[#775541] hover:bg-[#59382D]"
          >
            Order Sheets
          </a>
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-[#775541] border border-[#775541] hover:text-white hover:bg-[#59382D] transition-colors duration-200 px-3 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default withProtectedRoute(HomePage);
