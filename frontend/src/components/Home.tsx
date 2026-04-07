import React from 'react';
import Header from './Header';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Delicious Cakes for Every Occasion
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100">
            Handcrafted with love, delivered with care
          </p>
          <a 
            href="/cakes"
            className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-100 transition-all duration-200 inline-block shadow-lg"
          >
            Order Now
          </a>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-pink-600 text-4xl mb-4">🎂</div>
              <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">Only the finest ingredients for the best taste</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-pink-600 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery available in select areas</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-pink-600 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Custom Designs</h3>
              <p className="text-gray-600">Personalized cakes for your special moments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=400&fit=crop" 
            alt="Cake Banner" 
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
