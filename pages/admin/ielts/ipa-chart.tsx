import React from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Common/Breadcrumbs';

const ipaData = [
  // Vowels
  { symbol: 'iː', label: 'sheep', type: 'vowel' },
  { symbol: 'ɪ', label: 'ship', type: 'vowel' },
  { symbol: 'ʊ', label: 'put', type: 'vowel' },
  { symbol: 'uː', label: 'moon', type: 'vowel' },
  { symbol: 'ɜː', label: 'her', type: 'vowel' },
  { symbol: 'ə', label: 'about', type: 'vowel' },
  { symbol: 'e', label: 'bed', type: 'vowel' },
  { symbol: 'ɜː', label: 'her', type: 'vowel' },
  { symbol: 'ɔː', label: 'door', type: 'vowel' },
  { symbol: 'æ', label: 'cat', type: 'vowel' },
  { symbol: 'ʌ', label: 'cup', type: 'vowel' },
  { symbol: 'ɑː', label: 'car', type: 'vowel' },
  { symbol: 'ɒ', label: 'dog', type: 'vowel' },
  { symbol: 'eɪ', label: 'train', type: 'diphthong' },
  { symbol: 'aɪ', label: 'my', type: 'diphthong' },
  { symbol: 'ɔɪ', label: 'boy', type: 'diphthong' },
  { symbol: 'aʊ', label: 'now', type: 'diphthong' },
  { symbol: 'əʊ', label: 'go', type: 'diphthong' },
  { symbol: 'ɪə', label: 'ear', type: 'diphthong' },
  { symbol: 'eə', label: 'hair', type: 'diphthong' },
  { symbol: 'ʊə', label: 'tour', type: 'diphthong' },
  // Consonants
  { symbol: 'p', label: 'pen', type: 'consonant' },
  { symbol: 'b', label: 'ball', type: 'consonant' },
  { symbol: 't', label: 'table', type: 'consonant' },
  { symbol: 'd', label: 'dog', type: 'consonant' },
  { symbol: 'k', label: 'key', type: 'consonant' },
  { symbol: 'g', label: 'go', type: 'consonant' },
  { symbol: 'tʃ', label: 'chips', type: 'consonant' },
  { symbol: 'dʒ', label: 'jam', type: 'consonant' },
  { symbol: 'f', label: 'fire', type: 'consonant' },
  { symbol: 'v', label: 'video', type: 'consonant' },
  { symbol: 'θ', label: 'think', type: 'consonant' },
  { symbol: 'ð', label: 'this', type: 'consonant' },
  { symbol: 's', label: 'see', type: 'consonant' },
  { symbol: 'z', label: 'zebra', type: 'consonant' },
  { symbol: 'ʃ', label: 'shop', type: 'consonant' },
  { symbol: 'ʒ', label: 'television', type: 'consonant' },
  { symbol: 'm', label: 'man', type: 'consonant' },
  { symbol: 'n', label: 'no', type: 'consonant' },
  { symbol: 'ŋ', label: 'sing', type: 'consonant' },
  { symbol: 'h', label: 'house', type: 'consonant' },
  { symbol: 'l', label: 'leg', type: 'consonant' },
  { symbol: 'r', label: 'red', type: 'consonant' },
  { symbol: 'j', label: 'yes', type: 'consonant' },
  { symbol: 'w', label: 'we', type: 'consonant' },
];

const getColor = (type: string) => {
  if (type === 'vowel') return 'bg-orange-100 hover:bg-orange-200';
  if (type === 'diphthong') return 'bg-yellow-100 hover:bg-yellow-200';
  return 'bg-blue-100 hover:bg-blue-200';
};

export default function IPAChartPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Breadcrumbs parentLabel="IELTS Intensive Speaking" parentHref="/admin/ielts/speaking" currentLabel="IPA Chart" />
      <h1 className="text-3xl font-bold text-center mb-8">IPA Phonemic Chart</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {ipaData.map((item) => (
          <Link
            key={item.symbol}
            href={`/admin/ielts/ipa/${encodeURIComponent(item.symbol)}`}
            className={`flex flex-col items-center justify-center rounded-lg shadow-md p-4 text-2xl font-bold transition-colors ${getColor(item.type)} cursor-pointer`}
            title={item.label}
          >
            <span>{item.symbol}</span>
            <span className="text-xs font-normal mt-1 text-gray-600">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 