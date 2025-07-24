import Link from 'next/link';

interface BreadcrumbsProps {
  parentLabel: string;
  parentHref: string;
  currentLabel: string;
}

export default function Breadcrumbs({ parentLabel, parentHref, currentLabel }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-base mb-6">
      <Link href={parentHref} className="text-blue-700 hover:underline font-medium">
        {parentLabel}
      </Link>
      <span className="text-gray-400">&gt;</span>
      <span className="text-gray-800">{currentLabel}</span>
    </nav>
  );
} 