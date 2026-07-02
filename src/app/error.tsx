'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-app)]">
      <div className="text-center max-w-md p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
        <p className="text-[var(--color-text-muted)] mb-6">{error.message || 'An unexpected error occurred'}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
