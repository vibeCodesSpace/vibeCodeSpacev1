import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4">VibeCode</h1>
        <p className="text-xl mb-8">
          Turn Ideas into Live Web Applications with AI.
        </p>
        <a
          href="/auth"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">
                Multi-AI Provider Support
              </h3>
              <p>Leverage the best AI for the job (GPT-4o, Claude, Gemini).</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Text-to-App Generation</h3>
              <p>Create anything from landing pages to functional web apps.</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Resume-to-Portfolio</h3>
              <p>Automated, professional portfolio generation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Are Saying
        </h2>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="mb-4">
                "VibeCode is a game-changer. I was able to create a portfolio
                site in minutes."
              </p>
              <p className="font-bold">- A Happy Developer</p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="mb-4">
                "I don't know how to code, but with VibeCode, I was able to
                launch my business's landing page in an afternoon."
              </p>
              <p className="font-bold">- A Happy Entrepreneur</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
