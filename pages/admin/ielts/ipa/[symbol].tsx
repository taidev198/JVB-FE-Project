import { useRouter } from 'next/router';
import { useGetIpaDataQuery } from '@/services/portalHomeApi';
import { skipToken } from '@reduxjs/toolkit/query';
import Breadcrumbs from '@/components/Common/Breadcrumbs';

export default function IpaSoundPage() {
  const router = useRouter();
  const { symbol } = router.query;
  const { data, isLoading, error } = useGetIpaDataQuery(
    symbol ? { symbol: symbol as string } : skipToken
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading IPA data.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Breadcrumbs parentLabel="IPA Chart" parentHref="/admin/ielts/ipa-chart" currentLabel={`IPA: ${symbol}`} />
      <h1 className="text-2xl font-bold mb-4">IPA: {symbol}</h1>
      {/* Video player for the symbol */}
      <div className="mb-6">
        <video controls className="w-full rounded-lg shadow-md">
          <source src={symbol ? `http://localhost:8082/api/ipa/video/${encodeURIComponent(symbol as string)}` : ''} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className="prose mb-6"
        dangerouslySetInnerHTML={{ __html: data?.bookContent?.replace(/\n/g, '<br/>') || '' }}
      />
      <h2 className="text-lg font-semibold mb-2">Audio</h2>
      <ul>
        {data?.audioFiles?.map((url: string) => (
          <li key={url} className="mb-2">
            <audio controls src={url} />
          </li>
        ))}
      </ul>
    </div>
  );
}