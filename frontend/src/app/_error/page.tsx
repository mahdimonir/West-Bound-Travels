export const dynamic = 'force-dynamic';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">500 - Server Error</h1>
      <p className="text-lg text-gray-600 mb-6">Something went wrong. Please try again later.</p>
    </div>
  );
}
