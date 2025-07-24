import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function IpaSoundPage() {
  const router = useRouter();
  const { symbol } = router.query;
  const [bookContent, setBookContent] = useState('');
  const [audioFiles, setAudioFiles] = useState<string[]>([]);

  useEffect(() => {
    if (symbol) {
      fetch(`/api/ipa/${encodeURIComponent(symbol as string)}`)
        .then(res => res.json())
        .then(data => {
          setBookContent(data.bookContent);
          setAudioFiles(data.audioFiles);
        });
    }
  }, [symbol]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">IPA: {symbol}</h1>
      <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: bookContent.replace(/\n/g, '<br/>') }} />
      <h2 className="text-lg font-semibold mb-2">Audio</h2>
      <ul>
        {audioFiles.map((url, i) => (
          <li key={url} className="mb-2">
            <audio controls src={url} />
          </li>
        ))}
      </ul>
    </div>
  );
} 