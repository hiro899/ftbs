import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';

function AllChats() {
  const [telegramId, setTelegramId] = useState('');
  const [chatData, setChatData] = useState([]);
  const [chatHistory, setChatHistory] = useState(null); // 追加: チャット履歴を保存するstate
  const [isLoading, setIsLoading] = useState(true);

  // AIBotHistoriesAPI
  const LAMBDA_HISTORIES_URL = "https://eyjntjkpnnqo6w4xv6lnfwf6iy0frwfn.lambda-url.ap-northeast-1.on.aws/";
  // AIBotChatHistoryAPI
  const LAMBDA_CHAT_HISTORY_URL = "https://ha44aohuaeizu6rmrjlxoafkya0zsrox.lambda-url.ap-northeast-1.on.aws/";

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userInfo = await Auth.currentUserInfo();
        setTelegramId(userInfo.attributes['custom:telegram_id']);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (telegramId) {
      fetchChats();
    }
  }, [telegramId]);

  const fetchChats = async () => {
    setIsLoading(true);
  
    const payload = {
      "action": "get",
      "conditions": { "telegram_id": telegramId },
    };

    const res = await fetch(LAMBDA_HISTORIES_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });
  
    if (res.ok) {
      const data = await res.json();
      setChatData(data.chat_list);
      setIsLoading(false);
    } else {
      const errorData = await res.json();
      console.error('Error fetching chats:', errorData);
    }      
  };

  const fetchChatHistory = async (chat_id) => {
    // 追加: telegramIdとchat_idをconsole.logで出力
    console.log("telegramId:", telegramId);
    console.log("chat_id:", chat_id);

    const payload = {
      "action": "get",
      "conditions": { 
        "telegram_id": telegramId,
        "chat_id": chat_id
      },
    };

    // 追加: payloadを出力
    console.log("Sending request payload:", JSON.stringify(payload));

    const res = await fetch(LAMBDA_CHAT_HISTORY_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      const data = await res.json();
      setChatHistory(data); // チャット履歴をstateに保存
    } else {
      const errorData = await res.json();
      console.error('Error fetching chat history:', errorData);
       // 追加: エラー内容も出力
      console.error('Error fetching chat history:', errorData, 'Payload:', payload);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <HeaderBar />
      {isLoading ? (
        <h1 className="text-4xl mb-6">Loading...</h1>
      ) : (
        <>
          <h1 className="text-4xl mb-6">チャット一覧</h1>
          <div className="flex flex-col mt-4">
            {chatData && chatData.length > 0 && chatData.map((chat, i) => (
              <div key={i} className="w-full pl-0 mb-4 cursor-pointer hover:bg-gray-200" onClick={() => fetchChatHistory(chat.chat_id)}>
                <div className="p-2">
                  <p className="whitespace-nowrap">Chat ID: {chat.chat_id}</p>
                  <p className="whitespace-nowrap">{chat.max_time.split(".")[0]}</p>
                </div>
              </div>
            ))}
          </div>
          {/* 追加: チャット履歴を表示 */}
          {chatHistory && (
            <div className="mt-4">
              <h2 className="text-3xl mb-4">チャット履歴</h2>
              <pre>{JSON.stringify(chatHistory, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default withProtectedRoute(AllChats);
