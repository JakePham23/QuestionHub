'use client';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <Result
      status="404"
      title="Page Not Found"
      subTitle={
        isDev
          ? 'This route does not exist (Dev Mode)'
          : 'Sorry, the page you visited does not exist.'
      }
      extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
    />
  );
}
