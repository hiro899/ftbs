import React, { useState, useEffect, useRef } from "react";
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';


function Upload() {
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("");
  const [payment, setPayment] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const styleInputRef = useRef(null);
  const paymentInputRef = useRef(null);

  const LAMBDA_FUCNTION_URL = "https://i5mgmvaytudclyke4rmqgco4ty0ftbyi.lambda-url.ap-northeast-1.on.aws/";

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await Auth.currentUserInfo();
      setTelegramId(userInfo.attributes['custom:telegram_id']);
    };
    fetchUserInfo();
  }, []);
  
  const submitForm = async (e) => {
    e.preventDefault();
    
    // Create a new FormData instance
    let data = new FormData();

    // Add the file, style, payment, and telegramId to the form data
    data.append("file", file);
    data.append("style", style);
    data.append("payment", payment);
    data.append("telegram_id", telegramId);

    // Send the form data to the server
    const res = await fetch(LAMBDA_FUCNTION_URL, {
      method: "POST",
      body: data,
    });

    // If the upload was successful, update the uploadSuccess state
    if (res.ok) {
      setUploadSuccess(true);
      // Clear the input fields
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // 画像ファイル入力をクリア
      }
      // Clear other input fields
      if (styleInputRef.current) {
        styleInputRef.current.value = ""; // スタイル入力をクリア
      }
      if (paymentInputRef.current) {
        paymentInputRef.current.value = ""; // 課金額入力をクリア
      }
      // Wait for 3 seconds, then set uploadSuccess back to false
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <HeaderBar />
      <h1 className="text-4xl mb-8">画像アップロード</h1>
      <form onSubmit={submitForm} className="w-full max-w-md">
        <div className="mb-4">
          <input
            type="text"
            value={telegramId}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-300"
          />
        </div>
        <label className="flex flex-col mb-4">
          画像ファイル
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="flex flex-col mb-4">
          スタイル（英数字）
          <input
            type="text"
            ref={styleInputRef}
            placeholder="例：bikini"
            onChange={(e) => setStyle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="flex flex-col mb-4">
          価格￥（半角数字・200以上）
          <input
            type="text"
            ref={paymentInputRef}
            placeholder="例：500"
            pattern="^[0-9]*$"
            onChange={(e) => setPayment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
        <label className="mb-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            送信
          </button>
        </label>
      </form>
      {uploadSuccess && <p className="text-green-500 text-2xl">アップロード成功！</p>} 
    </div>
  );
}

export default withProtectedRoute(Upload);