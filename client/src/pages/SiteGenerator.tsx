
import React, { useState } from 'react';

const SiteGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [site, setSite] = useState<{ html: string; css: string; js: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSite(null);

    try {
      const response = await fetch('/api/ai/generate-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate site.');
      }

      const data = await response.json();
      setSite(data.site);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Site Generator</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Enter a prompt to generate a site
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Site'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {site && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Site</h2>
          <iframe
            srcDoc={`<html><head><style>${site.css}</style></head><body>${site.html}<script>${site.js}</script></body></html>`}
            title="Generated Site"
            className="w-full h-96 border"
          />
        </div>
      )}
    </div>
  );
};

export default SiteGenerator;
