import Button from '@/components/ui/Button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Booking Terms</h2>
          <p className="text-gray-700 mb-4">
            By making a booking with West Bound Travels, you agree to the following terms:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Minimum booking is 1 room for 2 days/1 night</li>
            <li>All bookings must be confirmed with full payment or deposit</li>
            <li>Bookings are subject to availability</li>
            <li>You must provide accurate information during booking</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Payment</h2>
          <p className="text-gray-700 mb-6">
            Payment can be made through bKash or SSLCommerz. Full payment is required to confirm 
            your booking. Payment confirmation will be sent via email within 24 hours.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cancellation Policy</h2>
          <p className="text-gray-700 mb-6">
            Please refer to our separate <a href="/cancellation" className="text-primary-600 hover:underline">Cancellation Policy</a> for detailed information about cancellations and refunds.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Guest Responsibilities</h2>
          <p className="text-gray-700 mb-4">
            Guests are responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Following safety instructions provided by crew</li>
            <li>Respecting boat property and other guests</li>
            <li>Arriving on time for departure</li>
            <li>Bringing necessary travel documents and medications</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Safety & Liability</h2>
          <p className="text-gray-700 mb-6">
            West Bound Travels prioritizes your safety. However, guests participate in activities 
            at their own risk. We are not liable for personal injury, loss, or damage to personal 
            belongings except in cases of our negligence.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Changes to Services</h2>
          <p className="text-gray-700 mb-6">
            We reserve the right to modify itineraries due to weather conditions, safety concerns, 
            or unforeseen circumstances. We will provide alternative arrangements of equal value 
            when possible.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact</h2>
          <p className="text-gray-700 mb-6">
            For questions about these terms, contact us at info@westboundtravels.com
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button href="/contact" variant="primary">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
