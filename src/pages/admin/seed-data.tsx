import { useState } from 'react';
import Link from 'next/link';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { adminFetch } from '../../utils/adminApi';
import { FiDatabase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSeedData = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await adminFetch('/api/admin/seed-sample-data', {
        method: 'POST'
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAdminLayout activeTab="seed-data">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Seed Sample Data</h1>
          <p className="text-zinc-400">
            Populate your database with sample case studies, blogs, and categories
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <FiDatabase className="text-blue-400 text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">About Sample Data</h3>
              <p className="text-blue-200/70 text-sm mb-3">
                This will automatically create sample data if none exists:
              </p>
              <ul className="text-blue-200/70 text-sm space-y-1 list-disc list-inside">
                <li>5 Blog Categories (Technology, Design, Business, Development, Marketing)</li>
                <li>4 Case Studies with full details and images</li>
                <li>5 Blog Posts with various categories and tags</li>
              </ul>
              <p className="text-blue-200/70 text-sm mt-3">
                <strong>Note:</strong> This won't duplicate data if it already exists.
              </p>
            </div>
          </div>
        </div>

        {/* Seed Button */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 
                     text-white font-semibold rounded-lg transition-all duration-200
                     disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <FiDatabase className="text-xl" />
                Seed Sample Data
              </>
            )}
          </button>
        </div>

        {/* Success Result */}
        {result && (
          <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <FiCheckCircle className="text-green-400 text-xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">
                  {result.message}
                </h3>
                <p className="text-green-200/70 text-sm">
                  Sample data has been successfully added to your database
                </p>
              </div>
            </div>

            {/* Results Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Blog Categories</div>
                <div className="text-white text-2xl font-bold">
                  {result.results?.categories?.created || 0}
                  <span className="text-sm text-zinc-500 ml-2">created</span>
                </div>
                {result.results?.categories?.existed > 0 && (
                  <div className="text-zinc-500 text-xs mt-1">
                    ({result.results.categories.existed} already existed)
                  </div>
                )}
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Case Studies</div>
                <div className="text-white text-2xl font-bold">
                  {result.results?.caseStudies?.created || 0}
                  <span className="text-sm text-zinc-500 ml-2">created</span>
                </div>
                {result.results?.caseStudies?.existed > 0 && (
                  <div className="text-zinc-500 text-xs mt-1">
                    ({result.results.caseStudies.existed} already existed)
                  </div>
                )}
              </div>

              <div className="bg-zinc-900/50 rounded-lg p-4">
                <div className="text-zinc-400 text-sm mb-1">Blog Posts</div>
                <div className="text-white text-2xl font-bold">
                  {result.results?.blogs?.created || 0}
                  <span className="text-sm text-zinc-500 ml-2">created</span>
                </div>
                {result.results?.blogs?.existed > 0 && (
                  <div className="text-zinc-500 text-xs mt-1">
                    ({result.results.blogs.existed} already existed)
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-6 pt-6 border-t border-green-500/20">
              <p className="text-green-200/70 text-sm mb-3">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-green-200/70 text-sm space-y-1">
                <li>✓ Visit <Link href="/admin/case-studies" className="text-green-400 hover:underline">Case Studies</Link> to manage your case studies</li>
                <li>✓ Visit <Link href="/admin/blogs" className="text-green-400 hover:underline">Blogs</Link> to manage your blog posts</li>
                <li>✓ Visit <Link href="/case-studies" className="text-green-400 hover:underline">Case Studies Page</Link> to see the public view</li>
                <li>✓ Visit <Link href="/blog" className="text-green-400 hover:underline">Blog Page</Link> to see the public view</li>
              </ul>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-red-400 text-xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Error</h3>
                <p className="text-red-200/70 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
}

