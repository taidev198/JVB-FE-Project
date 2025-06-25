import React, { useState } from 'react';
import { Button, Input, Typography, message } from 'antd';

const { Title } = Typography;

const ChatGPTCrawlPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrawl = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/crawl-chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data.response);
      } else {
        message.error('Failed to crawl ChatGPT');
      }
    } catch (err) {
      message.error('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3}>Crawl ChatGPT (Web)</Title>
      <Input.TextArea
        placeholder="Enter your prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        rows={4}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" block onClick={handleCrawl} loading={loading}>
        Send to ChatGPT & Crawl
      </Button>
      {result && (
        <div style={{ marginTop: 24 }}>
          <Title level={4}>Result:</Title>
          <div style={{ whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTCrawlPage;