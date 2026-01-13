'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Đã có lỗi xảy ra</h2>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: 16, borderRadius: 8, marginTop: 16 }}>{error?.message}</pre>
      <button onClick={() => reset()} style={{ marginTop: 16, padding: '8px 16px', cursor: 'pointer' }}>Thử lại</button>
    </div>
  );
}
