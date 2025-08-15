'use client';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  return (
<>
      {isDev ? (
        <Result
          status="500"
          title="Error (Dev Mode)"
          subTitle={
            <>
              <p>{error.message}</p>
              <pre
                style={{
                  textAlign: 'left',
                  background: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  overflowX: 'auto',
                }}
              >
                {error.stack}
              </pre>
            </>
          }
          extra={<Button onClick={() => reset()}>Try Again</Button>}
        />
      ) : (
        <Result
          status="500"
          title="Something went wrong"
          subTitle="Please try again later."
          extra={<Button onClick={() => router.push('/')}>Back Home</Button>}
        />
      )}
    </>
  );
}