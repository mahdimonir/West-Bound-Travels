import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Safety First',
      description: 'Your safety is our top priority with certified crew and modern equipment.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      title: 'Luxury Comfort',
      description: 'Premium houseboats with modern amenities for an unforgettable experience.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flexible Packages',
      description: 'Customizable trips to match your schedule and preferences.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Expert Team',
      description: 'Experienced captains and crew dedicated to your satisfaction.',
    },
  ];

  const team = [
    { name: 'Captain Rahman', role: 'Lead Captain', experience: '15+ years' },
    { name: 'Chef Karim', role: 'Head Chef', experience: '10+ years' },
    { name: 'Farhan Ahmed', role: 'Tour Coordinator', experience: '8+ years' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-hero text-white py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            About <span className="text-gradient-gold">West Bound Travels</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Bringing you closer to Bangladesh's natural wonders through luxury houseboat experiences
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                West Bound Travels was born from a passion for showcasing the untouched beauty 
                of Tanguar Haor and the surrounding regions of Sylhet. What started as a dream 
                to share these hidden gems with travelers has grown into Bangladesh's premier 
                luxury houseboat tour service.
              </p>
              <p>
                We believe that experiencing nature shouldn't mean compromising on comfort. 
                Our fleet of premium houseboats combines traditional charm with modern amenities, 
                offering you the perfect base to explore crystal-clear waters, lush green hills, 
                and stunning wetlands.
              </p>
              <p>
                With years of experience navigating the haor, our dedicated team ensures every 
                journey is safe, comfortable, and filled with unforgettable moments. We're not 
                just a tour operator – we're your gateway to discovering the soul of Bangladesh's 
                natural heritage.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero-boat.jpg"
                alt="West Bound Travels houseboat"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card luxury={true}>
            <div className="p-8">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide exceptional luxury houseboat experiences that connect travelers 
                with Bangladesh's pristine natural beauty while promoting sustainable tourism 
                and supporting local communities.
              </p>
            </div>
          </Card>

          <Card luxury={true}>
            <div className="p-8">
              <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading eco-tourism provider in Bangladesh, setting standards 
                for luxury water travel while preserving the natural ecosystems we explore 
                for future generations to enjoy.
              </p>
            </div>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Core <span className="text-gradient-primary">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} hover={true}>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Meet Our <span className="text-gradient-primary">Team</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our experienced professionals are dedicated to making your journey safe, 
            comfortable, and unforgettable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Embark on Your Adventure?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join us on an unforgettable journey through Bangladesh's most beautiful waterways.
          </p>
          <Button href="/booking" variant="secondary" size="lg" className="shadow-gold">
            Book Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}
