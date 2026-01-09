import Image from 'next/image';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/West-Bound-Travels-Hero.png"
            alt="Luxury houseboat on Tanguar Haor"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Explore Luxury Waters with{' '}
            <span className="text-gradient-gold block mt-2">
              West Bound Travels
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
            Discover the pristine beauty of Tanguar Haor aboard our premium houseboats. 
            Experience comfort, adventure, and memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button href="/booking" size="lg" variant="secondary">
              Book Your Journey
            </Button>
            <Button 
              href="/boats" 
              size="lg" 
              variant="outline"
            >
              Explore Our Fleet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
