'use client';
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const LatexRenderer: React.FC<{ text?: string }> = ({ text = '' }) => {
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/);
  return (
    <span style={{ lineHeight: '1.6' }}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const content = part.slice(2, -2);
          return <BlockMath key={index} math={content} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const content = part.slice(1, -1);
          return <InlineMath key={index} math={content} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default LatexRenderer;