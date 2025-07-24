import Link from 'next/link';
import Breadcrumbs from '@/components/Common/Breadcrumbs';

const gridItems = [
  {
    title: 'Pronunciation',
    link: '/admin/ielts/ipa-chart',
    progress: 70,
    total: 20,
  },
  {
    title: 'Fluency',
    link: '/admin/ielts/fluency',
    progress: 40,
    total: 15,
  },
  {
    title: 'Intonation',
    link: '/admin/ielts/intonation',
    progress: 55,
    total: 10,
  },
  {
    title: 'Connected Speech',
    link: '/admin/ielts/connected-speech',
    progress: 80,
    total: 25,
  },
];

export default function SpeakingDashboard() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Breadcrumbs parentLabel="IELTS Dashboard" parentHref="/admin/ielts" currentLabel="IELTS Intensive Speaking" />
      <h1 className="text-2xl font-bold mb-8">Speaking Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {gridItems.map((item) => (
          <Link href={item.link} key={item.title}>
            <div className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <div className="w-full flex flex-col items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">Progress: {item.progress}%</span>
              </div>
              <div className="text-gray-700 text-lg font-medium">Total Programs: {item.total}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 