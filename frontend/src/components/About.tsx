import React from 'react';
import Header from './Header';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-purple-100">Our Sweet Story</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Our Story */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
              <div className="relative w-full h-64 mb-6">
                <img 
                  src="/images/bakery-interior.jpg" 
                  alt="Bakery Interior" 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback for interior photo */}
                <div 
                  className="hidden w-full h-64 rounded-lg bg-pink-50 border-2 border-dashed border-pink-200 flex-col items-center justify-center text-pink-400 space-y-2"
                  style={{ display: 'none' }}
                >
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="font-medium text-sm">Add your real bakery photo here!</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded in 2020, Addis Cake and Bakery (አዲስ ኬክ እና ዳቦ ቤት | Addis Keekii fi Baakkarii) began as a small home bakery with a big dream: 
                to bring joy to people's lives through exceptional cakes. What started as a 
                passion project has grown into a beloved local business serving hundreds of 
                happy customers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Every cake we create is a labor of love, made with carefully selected ingredients 
                and crafted by skilled bakers who are passionate about their art. We believe that 
                quality matters, and that every celebration deserves something special.
              </p>
            </div>

            {/* Our Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold mb-4 text-pink-600">Quality First</h3>
                <p className="text-gray-600">
                  We source only premium ingredients from trusted suppliers. No shortcuts, 
                  no compromises - just pure, delicious quality in every bite.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-semibold mb-4 text-pink-600">Customer Focus</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We work closely with you to create 
                  the cake of your dreams, exactly as you envision it.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Meet Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Baye', role: 'Head Baker & Founder', img: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop', initial: 'B' },
                  { name: 'Temesgen', role: 'Addis Pastry Chef', img: '/images/temesgen.png', initial: 'T' },
                  { name: 'Hibist', role: 'Decoration', img: '/images/hibist.png', initial: 'H' }
                ].map((member) => (
                  <div key={member.name} className="text-center group">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      {/* Using a helper to handle broken images */}
                      <img 
                        src={member.img} 
                        alt={member.name} 
                        className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-pink-50 transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      {/* Fallback Placeholder (Hidden by default) */}
                      <div 
                        className="hidden absolute inset-0 w-32 h-32 rounded-full bg-pink-100 border-4 border-pink-200 flex items-center justify-center text-pink-600 text-4xl font-bold shadow-inner"
                        style={{ display: 'none' }}
                      >
                        {member.initial}
                      </div>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-900">{member.name}</h4>
                    <p className="text-pink-600 font-medium">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
