// src/app/layout.tsx

import React from 'react';
import './globals.css';
import 'katex/dist/katex.min.css';
import RootClientLayout from './RootClientLayout'; // Import the client wrapper

export const metadata = {
  title: 'Question Hub Education',
  description: 'Ngân hàng đề thi trắc nghiệm Toán - Vật Lý - Hóa khổng lồ, bám sát chương trình học cho mọi cấp lớp với công nghệ AI tiên tiến.',
  openGraph: {
    title: 'Question Hub Education',
    description: 'Ngân hàng đề thi trắc nghiệm Toán - Vật Lý - Hóa khổng lồ, bám sát chương trình học cho mọi cấp lớp với công nghệ AI tiên tiến.',
    images: [
      {
        url: './public/preview.png', // The public folder is the root URL
        alt: 'Question Hub Education',
      },
    ],
  },
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}