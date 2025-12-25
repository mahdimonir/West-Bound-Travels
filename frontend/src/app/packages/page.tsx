import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function PackagesPage() {
  const inclusions = [
    'Minimum 2 days / 1 night stay',
    '5 premium meals (Breakfast, Lunch, Snacks, Dinner, Breakfast)',
    'Visit to 5 destinations of your choice from 7 locations',
    'Comfortable accommodations with modern amenities',
    'Experienced captain and crew',
    'Life jackets and safety equipment',
    'Complimentary drinking water',
    'Onboard entertainment system',
  ];

  const menuItems = [
    {
      meal: 'Breakfast',
      items: ['Paratha/Roti', 'Eggs (omelette/boiled)', 'Dal', 'Vegetables', 'Tea/Coffee'],
    },
    {
      meal: 'Lunch',
      items: ['Rice', 'Chicken Curry', 'Fish Curry', 'Dal', 'Mixed Vegetables', 'Salad'],
    },
    {
      meal: 'Snacks',
      items: ['Singara', 'Pitha', 'Seasonal Fruits', 'Tea/Coffee'],
    },
    {
      meal: 'Dinner',
      items: ['Rice/Polao', 'Meat Curry', 'Fish Fry', 'Dal', 'Vegetables', 'Dessert'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Packages & <span className="text-gradient-luxury">Pricing</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Everything you need for an unforgettable houseboat adventure, 
            all included in one premium package.
          </p>
        </div>
      </section>

      {/* Package Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Houseboat Experience
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Our all-inclusive packages are designed to give you a hassle-free, 
              luxurious experience on the waters of Tanguar Haor. Book a single room 
              or rent an entire houseboat for your group.
            </p>
            <div className="bg-luxury-50 border-l-4 border-luxury-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-luxury-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Minimum Booking
              </h3>
              <p className="text-gray-700">
                Minimum 1 room for 2 days/1 night. Full boat rental available for larger groups.
              </p>
            </div>
          </div>

          <Card luxury={true}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Package Inclusions
              </h3>
              <ul className="space-y-3">
                {inclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-accent-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Menu Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Premium <span className="text-gradient-primary">Meal Menu</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Enjoy authentic Bengali cuisine prepared fresh on board. 
            All meals included in your package.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((menu, index) => (
              <Card key={index} hover={true} className="h-full">
                <div className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{menu.meal}</h3>
                  <ul className="space-y-2">
                    {menu.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-1.5 h-1.5 bg-luxury-500 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Note */}
        <Card luxury={true} className="mb-16">
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Custom Pricing
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Pricing varies based on boat type (AC/Non-AC), number of rooms, 
              travel dates, and selected destinations. Get a personalized quote 
              by completing your booking details.
            </p>
            <Button href="/booking" variant="luxury" size="lg">
              Get Your Quote & Book Now
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-luxury-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-luxury-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Flexible Payment</h4>
            <p className="text-gray-600">bKash & SSLCommerz accepted</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Safe & Secure</h4>
            <p className="text-gray-600">Life jackets & safety equipment</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h4>
            <p className="text-gray-600">Contact us anytime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions About Our Packages?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Our team is here to help you plan the perfect trip. Get in touch for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="luxury" size="lg">
              Contact Us
            </Button>
            <Button 
              href="/boats" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary-600 border-2 border-white"
            >
              View Our Fleet
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
