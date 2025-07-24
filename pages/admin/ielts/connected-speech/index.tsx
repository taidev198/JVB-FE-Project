import Breadcrumbs from '@/components/Common/Breadcrumbs';

export default function ConnectedSpeechPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Breadcrumbs parentLabel="IELTS Intensive Speaking" parentHref="/admin/ielts/speaking" currentLabel="Connected Speech" />
      <h1 className="text-2xl font-bold mb-6">Connected Speech - Introduction</h1>
      <div className="mb-6">
        <video controls className="w-full rounded-lg shadow-md">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="prose max-w-none">
        <p>
          Connected speech refers to the way spoken language is not pronounced word by word, but rather as a continuous stream. In English, this means sounds at word boundaries often change, disappear, or link together. Mastering connected speech will help you sound more natural and fluent.
        </p>
        <ul>
          <li>Linking: joining words together</li>
          <li>Assimilation: sounds change to become more like neighboring sounds</li>
          <li>Elision: sounds are omitted</li>
        </ul>
      </div>
    </div>
  );
} 