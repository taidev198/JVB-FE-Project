import React from 'react';

interface HtmlContentRendererProps {
  htmlContent: string;
}

const HtmlContentRenderer: React.FC<HtmlContentRendererProps> = ({ htmlContent }) => {
  // Normalize input to handle commas and irregular formatting
  const cleanContent = htmlContent
    .replace(/<\/ul>,?/g, '</ul>') // Remove commas after closing ul tags
    .replace(/<\/li>,?/g, '</li>') // Remove commas after closing li tags
    .replace(/<ul>\s*,\s*/g, '<ul>') // Remove commas after opening ul tags
    .replace(/<li>\s*,\s*/g, '<li>') // Remove commas inside li tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces with regular spaces for consistency
    .trim(); // Trim extra spaces around the content

  // Render the sanitized and styled HTML
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
