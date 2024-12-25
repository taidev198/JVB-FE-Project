import React from 'react';

interface HtmlContentRendererProps {
  htmlContent: string;
}

const HtmlContentRenderer: React.FC<HtmlContentRendererProps> = ({ htmlContent }) => {
  const cleanContent = htmlContent
    .split(',')
    .map(item => item.trim()) // Trim extra whitespace
    .join(''); // Join into a single string without commas
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: cleanContent.replace(
          /<li>/g,
          '<li class="relative py-[6px] flex items-start gap-5"><span class="flex-shrink-0 h-2 w-2 mt-[10px] rounded-full bg-primary-main"></span>'
        ),
      }}
    />
  );
};

export default HtmlContentRenderer;
