import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';
import Link from 'next/link'; 

function ImageList() {
  const [telegramId, setTelegramId] = useState('');
  const [imagesData, setImagesData] = useState([]);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // AIBotImagesAPI
  const LAMBDA_FUNCTION_URL = "https://tqex4vbtaeudcnpdl5s4ryfd5i0qgztq.lambda-url.ap-northeast-1.on.aws/";
  // aibotimages
  const S3_BUCKET_URL_BASE = "https://aibotimages.s3.ap-northeast-1.amazonaws.com";

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userInfo = await Auth.currentUserInfo();
        setTelegramId(userInfo.attributes['custom:telegram_id']);
      } catch (error) {
        console.error("画像取得中にエラーが発生しました", error);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (telegramId) {
      fetchImages();
    }
  }, [telegramId]);

  const fetchImages = async () => {
    setIsLoading(true);

    let payload = {
      "telegram_id": telegramId,
      "http_method": "POST",
    };
  
    const res = await fetch(LAMBDA_FUNCTION_URL, {
      method: "POST", //大量のデータを受信するのでPOSTを使用。GETではなく。
      body: JSON.stringify(payload),  
      headers: {
        'Content-Type': 'application/json'
      },
    });
  
    if (res.ok) {
      const data = await res.json();
      const body = JSON.parse(data.body);
  
      const imageData = body.map(item => ({ 
        s3_key: item.s3_key,
        telegram_id: item.telegram_id,
        image_id: item.image_id,
        url: `${S3_BUCKET_URL_BASE}/${item.s3_key}`, 
        style: item.style, 
        payment: item.payment 
      }));
  
      setImagesData(imageData);
      setFetchSuccess(true);
      setTimeout(() => setFetchSuccess(false), 3000);
      setIsLoading(false);
    }
  };  

  const handleImageClick = (imageData) => {
    setSelectedImage(imageData);
    setShowModal(true);
  };

  const handleInputChange = (field, event) => {  // Added new function to handle text input changes
    setSelectedImage({
      ...selectedImage,
      [field]: event.target.value
    });
  };

  const updateImageMetadata = async () => {
    const payload = {
      telegram_id: selectedImage.telegram_id,  // Use the stored telegram_id
      image_id: selectedImage.image_id,
      style: selectedImage.style,
      payment: selectedImage.payment,
      http_method: 'PUT',
    };

    const res = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'PUT', 
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      fetchImages();
      setShowModal(false);
    } else {
      // Handle error (e.g. show an error message)
    }
  };

  const deleteImage = async () => {
    const userConfirmation = window.confirm("本当に削除しますか？");
    if (userConfirmation) {
      const payload = {
        telegram_id: selectedImage.telegram_id,
        image_id: selectedImage.image_id,
        http_method: 'DELETE',
      };
  
      const res = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'DELETE',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        },
      });
  
      if (res.ok) {
        fetchImages();
        setShowModal(false);
      } else {
        // Handle error (e.g. show an error message)
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <HeaderBar />
        {isLoading ? (
        <h1 className="text-4xl mb-6">Loading...</h1>
      ) : (
        <>
          <h1 className="text-4xl mb-6">画像一覧</h1>
          {imagesData && imagesData.length === 0 && 
            <div className="text-2xl mb-6">
              <p>画像を<Link href="/upload"><a className="text-blue-500 hover:underline">アップロード</a></Link>してください</p>
            </div>
          }
          <div className="flex flex-wrap justify-center mt-4">
            {imagesData && imagesData.length > 0 && imagesData.map((imageData, i) => (
            <div 
              key={i} 
              className="w-1/3 p-1"
              onClick={() => handleImageClick(imageData)}
            >
              <img src={imageData.url} alt="fetched from lambda" className="w-full h-auto object-cover"/>
              <div className="mt-2">
                <p>スタイル: {imageData.style}</p>
                <p>価格￥: {imageData.payment}</p>
              </div>
            </div>
            ))}
          </div>
        </>
      )}

        {showModal && (
          <div id="modal" className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen">
              {/* Background part */}
              <div className="fixed inset-0 bg-black opacity-75" onClick={() => setShowModal(false)}></div>
              {/* Modal part */}
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg relative">
                {/* Close button */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <img src={selectedImage?.url} alt="selected" className="w-full h-auto object-cover"/>
                  <div className="mt-2">
                    <p>スタイル（英数字） </p>
                      <input 
                        type="text" 
                        value={selectedImage?.style} 
                        onChange={(e) => handleInputChange('style', e)}
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    <p>価格￥（半角数字・200以上） </p>
                      <input 
                        type="text" 
                        value={selectedImage?.payment} 
                        onChange={(e) => handleInputChange('payment', e)}
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    <button onClick={updateImageMetadata} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
                      情報更新
                    </button>
                    <button onClick={deleteImage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      画像削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}





    </div>
  );
}

export default withProtectedRoute(ImageList);