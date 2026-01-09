import Button from '@/components/ui/Button';

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cancellation & Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 2026</p>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellation by Guest</h2>
          
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-lg mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Refund Schedule</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>7+ days before departure:</strong> 50% refund</li>
              <li><strong>3-6 days before departure:</strong> 25% refund</li>
              <li><strong>Less than 3 days before departure:</strong> No refund</li>
              <li><strong>No-show:</strong> No refund</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">How to Cancel</h3>
          <p className="text-gray-700 mb-4">
            To cancel your booking:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 mb-6">
            <li>Contact us via email at info@westboundtravels.com or phone at +880 1676-663600</li>
            <li>Provide your booking reference number</li>
            <li>Specify the reason for cancellation</li>
            <li>Refunds will be processed within 7-10 business days</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cancellation by West Bound Travels</h2>
          <p className="text-gray-700 mb-4">
            We may cancel your booking in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>Severe weather conditions that make travel unsafe</li>
            <li>Technical issues with the houseboat</li>
            <li>Insufficient bookings to operate the trip</li>
            <li>Government restrictions or emergencies</li>
          </ul>

          <div className="bg-secondary-50 border-l-4 border-secondary-500 p-6 rounded-r-lg mb-6">
            <p className="text-gray-900 font-semibold mb-2">
              If we cancel your booking, you will receive:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>100% full refund, OR</li>
              <li>Option to reschedule to another date</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modifications</h2>
          <p className="text-gray-700 mb-6">
            Changes to your booking (dates, boat type, or room selection) are subject to 
            availability and may incur additional charges. Modification requests must be 
            made at least 5 days before departure.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Force Majeure</h2>
          <p className="text-gray-700 mb-6">
            We are not liable for cancellations or delays caused by events beyond our control, 
            including but not limited to natural disasters, political unrest, pandemics, or 
            acts of God.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact for Cancellations</h2>
          <p className="text-gray-700 mb-4">
            Email: info@westboundtravels.com
            <br />
            Phone: +880 1676-663600
            <br />
            Office Hours: 9:00 AM - 6:00 PM (Bangladesh Time)
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
          <Button href="/contact" variant="primary">
            Contact Us
          </Button>
          <Button href="/terms" className="bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-300">
            View Terms
          </Button>
        </div>
      </div>
    </div>
  );
}
