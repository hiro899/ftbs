import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import HeaderBar from '../components/HeaderBar';
import withProtectedRoute from '../hoc/withProtectedRoute';
import { useRouter } from 'next/router';

function CharacterForm() {
  const [characterData, setCharacterData] = useState(null);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [baseDescription, setBaseDescription] = useState('');

  // AIBotCharactersAPI
  const CHARACTER_API_URL = "https://c5n7gj2aqqzp52bszbrnnpezqe0vpyvo.lambda-url.ap-northeast-1.on.aws/";

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const userInfo = await Auth.currentUserInfo();
      const telegramId = userInfo.attributes['custom:telegram_id'];

      let payload = {
        "telegram_id": telegramId,
        "http_method": "GET",
      };

      const res = await fetch(CHARACTER_API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (res.ok) {
        const data = await res.json();
        const body = data.Item;

        if (!body) {
          router.push('/newCharacter');
          return;
        }

        if (!body.prompt_base_id) {
          body.prompt_base_id = '1';
        }
        
        // デフォルト値の設定用のオブジェクト
        const defaultValues = {
          "system_message": "",
          "telegram_token": "",
          "payment_token": "",
          "prompt_base_id": "1",
          "insufficient_billing_message": "",
          "no_image_message": "",
          "all_sended_message": "",
          "thanks_payment_message": "",
          "payment_trigger": "",
          "on_error_message": "",
          "item_name": "",
          "item_description": "",
          "price_label": "",
          "not_text_recieved_message": ""
        };

        // body（characterデータ）にデフォルト値を設定
        Object.keys(defaultValues).forEach(key => {
          if (!body[key]) {
            body[key] = defaultValues[key];
          }
        });

        setCharacterData(body);

        setFetchSuccess(true);
        setTimeout(() => setFetchSuccess(false), 3000);
      }
    } catch (error) {
      console.error("キャラクターデータ取得中にエラーが発生しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const updateCharacterData = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // データ更新開始時にロード状態をtrueに設定
    

    const payload = {
      ...characterData,
      http_method: 'PUT',
    };

    const res = await fetch(CHARACTER_API_URL, {
      method: 'PUT', 
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      fetchData();
      router.push('/'); // ここで遷移させる
    } else {
      // Handle error (e.g. show an error message)
    }

    setIsLoading(false);  // データ更新終了時にロード状態をfalseに設定
  };

  const handleInputChange = (field, event) => {
    setCharacterData({
      ...characterData,
      [field]: event.target.value
    });
  };

  // ベース設定の説明を更新する関数
  const handleBaseChange = (e) => {
    handleInputChange('prompt_base_id', e); // 既存の入力変更処理
    setBaseDescription(getDescription(e.target.value)); // 説明を更新
  };

  // getDescription関数は、prompt_base_idに応じた説明を返す
  const getDescription = (prompt_base_id) => {
    switch (prompt_base_id) {
      case '1':
        return '「まだ早いって言ってるでしょ！少し待ちなさい」\n「欲張りな貴方も可愛いわね。」';
      case '2':
        return '「やあ！こんにちは！」\n 「今日も一日楽しく過ごそうね！」';
      case '3':
        return '「ねえ、お気に入りの音楽とか何かある？」\n 「うーん、最近読んだ本の話でもいいかな？」';
      case '99':
        return '※全ての設定を自分で行います\n(上級者向け)';
      default:
        return '';
    }
  };

  

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <HeaderBar />
        <h1 className="text-4xl mb-6">Loading...</h1>
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <HeaderBar />
        <h1 className="text-4xl mb-6">ボット設定</h1>
        {characterData && (
          <form onSubmit={updateCharacterData} className="w-full max-w-md">
            <div className="mb-4">
              名前
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="例：あやか"
                value={characterData.character_name}
                onChange={(e) => handleInputChange('character_name', e)}
              />
            </div>
            <div className="mb-4">
            ベース設定（選択式）
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={characterData.prompt_base_id}
              onChange={handleBaseChange} 
            >
              <option value="1">１：女王様</option>
              <option value="2">２：元気っ子</option>
              <option value="3">３：おとなしい子</option>
              <option value="99">０：設定なし</option>
            </select>
            <div className="text-gray-600 mt-2" style={{ whiteSpace: 'pre-line' }}>
              {characterData && getDescription(characterData.prompt_base_id)}
            </div>
          </div>
            <div className="mb-4">
              追加設定(任意)
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="例：
                性格：ツンデレ
                趣味：ゲーム、アニメ、お絵かき
                好きな食べ物：お寿司
                年齢：20歳
                その他、口調など"
                rows="10"
                value={characterData.system_message}
                onChange={(e) => handleInputChange('system_message', e)}
              />
            </div>
            <div className="mb-4">
            課金トリガーワード
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="例：見せてください"
              value={characterData.payment_trigger}
              onChange={(e) => handleInputChange('payment_trigger', e)}
            />
          </div>
            <fieldset className="mb-4 p-4 border rounded">
              <legend className="text-xl font-bold">固定メッセージ</legend>
              <div className="text-gray-600 mt-2 mb-4">
                ※設定を推奨。空白の場合はメッセージ送信なし
              </div>
              <div className="mb-4">
              課金額が足りない場合
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="例：ちょっと足りないかも"
                value={characterData.insufficient_billing_message}
                onChange={(e) => handleInputChange('insufficient_billing_message', e)}
              />
              </div>
              <div className="mb-4">
                画像が存在していない場合
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：今は良いのないかな"
                  value={characterData.no_image_message}
                  onChange={(e) => handleInputChange('no_image_message', e)}
                />
              </div>
              <div className="mb-4">
                画像を全て送付済みの場合
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：今は良いのないかな"
                  value={characterData.all_sended_message}
                  onChange={(e) => handleInputChange('all_sended_message', e)}
                />
              </div>
              <div className="mb-4">
                支払いへの感謝
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：ありがとう！"
                  value={characterData.thanks_payment_message}
                  onChange={(e) => handleInputChange('thanks_payment_message', e)}
                />
              </div>
              <div className="mb-4">
                システムエラー時
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：ちょっと後でね"
                  value={characterData.on_error_message}
                  onChange={(e) => handleInputChange('on_error_message', e)}
                />
              </div>
              <div className="mb-4">
                テキスト以外が送信された場合
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：これなぁに？"
                  value={characterData.not_text_recieved_message}
                  onChange={(e) => handleInputChange('not_text_recieved_message', e)}
                />
              </div>
            </fieldset>
            <fieldset className="mb-4 p-4 border rounded">
              <legend className="text-xl font-bold">決済メッセージ</legend>
              <div className="text-gray-600 mt-2 mb-4">
                ※空白の場合は「お支払い」となります。Stripe社に見られる部分です。
              </div>
              <div className="mb-4">
                決済タイトル
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：お支払い"
                  value={characterData.item_name}
                  onChange={(e) => handleInputChange('item_name', e)}
                />
              </div>
              <div className="mb-4">
                内容説明
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：お支払い"
                  value={characterData.item_description}
                  onChange={(e) => handleInputChange('item_description', e)}
                />
              </div>
              <div className="mb-4">
                ラベル
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="例：お支払い"
                  value={characterData.price_label}
                  onChange={(e) => handleInputChange('price_label', e)}
                />
              </div>
            </fieldset>

            <fieldset className="mb-4 p-4 border rounded">
              <legend className="text-xl font-bold">トークン設定</legend>
                  <div className="mb-4">
                      Telegram Token
                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="例：88888888:XXXXxxxXXx-x8xx8xx8xx"
                          value={characterData.telegram_token}
                          onChange={(e) => handleInputChange('telegram_token', e)}
                      />
                  </div>
                  <div className="mb-4">
                      Payment Token
                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          placeholder="例：11111111:TEST:xxxxxxxxxxxx"
                          value={characterData.payment_token}
                          onChange={(e) => handleInputChange('payment_token', e)}
                      />
                  </div>
            </fieldset>
              <div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              保存
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default withProtectedRoute(CharacterForm);