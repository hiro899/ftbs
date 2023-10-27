import React, { useEffect } from 'react';

function TestLambdaAccess() {
  // Lambda関数のURL
  const CHAT_HISTORY_API_URL = "https://ha44aohuaeizu6rmrjlxoafkya0zsrox.lambda-url.ap-northeast-1.on.aws/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CHAT_HISTORY_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // これはダミーデータです。実際のテストに合わせて調整してください。
          body: JSON.stringify({
            telegram_id: 'dummy_telegram_id',
            chat_id: 'dummy_chat_id'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
        } else {
          console.log('Response not ok:', response.status);
          const errorData = await response.json();
          console.error('Error data:', errorData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Testing Lambda Access</h1>
    </div>
  );
}

export default TestLambdaAccess;
