import React from 'react';
import Link from 'next/link';

const HeaderIelts: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-400 to-purple-500 py-5 px-8 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-white">IELTS Admin</span>
        <Link href="/admin/ielts/tutorial" className="text-white font-semibold hover:underline">Tutorial</Link>
        <Link href="/admin/ielts/ipa-chart" className="text-white font-semibold hover:underline">Pronunciation</Link>
      </div>
      <div>
        <Link href="/" className="text-white font-semibold hover:underline">Back to Portal</Link>
      </div>
    </header>
  );
};

export default HeaderIelts; 