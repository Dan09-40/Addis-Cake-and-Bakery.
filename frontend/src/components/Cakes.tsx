import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';

interface Cake {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

const Cakes: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await axios.get<any>('http://localhost:5000/api/cakes');
      const fetchedCakes = response.data?.cakes || (Array.isArray(response.data) ? response.data : []);
      setCakes(fetchedCakes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cakes:', error);
      setCakes([]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Cakes</h1>
          <p className="text-xl text-pink-100">Delicious creations for every occasion</p>
        </div>
      </section>

      {/* Cake Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              <p className="mt-4 text-gray-600">Loading delicious cakes...</p>
            </div>
          ) : (
            <>
              {!cakes || cakes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No cakes available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cakes.map((cake) => (
                    <div key={cake._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="h-64 overflow-hidden">
                        {cake.image ? (
                          <img 
                            src={cake.image} 
                            alt={cake.name} 
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                            <span className="text-6xl">🎂</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-2xl font-bold text-gray-800">{cake.name}</h3>
                          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                            ${cake.price}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{cake.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {cake.category}
                          </span>
                          <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200 font-semibold">
                            Order Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Custom Orders Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Want Something Custom?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We create custom cakes for weddings, birthdays, and special events. 
            Contact us to discuss your dream cake!
          </p>
          <a 
            href="/contact"
            className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors duration-200 inline-block"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default Cakes;
