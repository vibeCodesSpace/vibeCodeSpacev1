import React, { useState } from "react";

const ResumePortfolio = () => {
  const [file, setFile] = useState<File | null>(null);
  const [portfolio, setPortfolio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);
    setPortfolio(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/ai/process-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process resume.");
      }

      const data = await response.json();
      setPortfolio(data.site.html);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resume to Portfolio</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="resume"
            className="block text-sm font-medium text-gray-700"
          >
            Upload your resume
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Portfolio"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {portfolio && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Portfolio</h2>
          <div dangerouslySetInnerHTML={{ __html: portfolio }} />
        </div>
      )}
    </div>
  );
};

export default ResumePortfolio;
