
import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4">VibeCode</h1>
        <p className="text-xl mb-8">Turn Ideas into Live Web Applications with AI.</p>
        <a href="#features" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Multi-AI Provider Support</h3>
              <p>Leverage the best AI for the job (GPT-4o, Claude, Gemini).</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Text-to-App Generation</h3>
              <p>Create anything from landing pages to functional web apps.</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Resume-to-Portfolio</h3>
              <p>Automated, professional portfolio generation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="mb-4">"VibeCode is a game-changer. I was able to create a portfolio site in minutes, not hours."</p>
              <p className="font-bold">- Jane Doe, Software Engineer</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="mb-4">"I don't know how to code, but with VibeCode, I was able to launch a website for my small business in an afternoon."</p>
              <p className="font-bold">- John Smith, Small Business Owner</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
