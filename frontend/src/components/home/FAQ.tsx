'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "What is included in the package?",
    answer: "Our packages include accommodation on the houseboat, all meals (breakfast, lunch, dinner, snacks), drinking water, tea/coffee, life jackets, and a professional guide."
  },
  {
    question: "Is it safe to travel during the monsoon?",
    answer: "Yes, our boats are designed for all weather conditions in the haor. However, we closely monitor weather alerts and prioritize safety above all else."
  },
  {
    question: "Can I customize my itinerary?",
    answer: "Absolutely! While we have standard routes to ensure you see the best spots, we are happy to tailor the journey to your preferences for private bookings."
  },
  {
    question: "Are there charging facilities on board?",
    answer: "Yes, all our houseboats are equipped with solar power and/or generators providing 220V charging points for your devices."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-gradient-primary">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-secondary-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-primary-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 text-gray-600 bg-gray-50 border-t border-gray-100 animate-fade-in text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
