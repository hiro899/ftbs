import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeaderBar from '../components/HeaderBar';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import withProtectedRoute from '../hoc/withProtectedRoute';

function HomePage () {
  const [telegramId, setTelegramId] = useState(null);

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

  useEffect(() => { // 追加
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setTelegramId(user.attributes['custom:telegram_id']);
      } catch (error) {
        console.log('Error on fetching user', error);
      }
    };
    fetchUser();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <HeaderBar /> 
      <h1 className="text-4xl mb-10">{telegramId && <p> {telegramId}</p>}</h1>
      <div className="flex flex-col space-y-4">
        <Link href="/upload">
          <a
            className="w-64 text-center block  px-10 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
          >
            画像アップロード
          </a>
        </Link>
        <Link href="/all_images">
          <a
            className="w-64 text-center block  px-10 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
          >
            画像一覧
          </a>
        </Link>
        <Link href="/all_chats">
          <a
            className="w-64 text-center block  px-10 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
          >
            チャット一覧
          </a>
        </Link>
        <Link href="/character">
          <a
            className="w-64 text-center block  px-10 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
          >
            ボット設定
          </a>
        </Link>
        <Link href="https://far-fluorine-09d.notion.site/0662c0efcdce4e77886974fe25c8e105">
          <a
            className="w-64 text-center block  px-10 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            使い方
          </a>
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-blue-500 border border-blue-500 hover:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors duration-200 px-3 py-2 rounded"
        >
          ログアウト
        </button>

      </div>
    </div>
  );
};

export default withProtectedRoute(HomePage);
