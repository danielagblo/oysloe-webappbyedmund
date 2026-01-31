import React from "react";
import { Helmet } from "react-helmet-async";

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What is Oysloe?",
      answer:
        "Oysloe is a digital marketplace platform that connects buyers and sellers. Whether you want to buy or sell products, Oysloe makes it simple and safe.",
    },
    {
      question: "Is it free to sign up?",
      answer:
        "Yes! Creating an account on Oysloe is completely free. You only pay fees when you make a successful sale.",
    },
    {
      question: "How do I post an ad?",
      answer:
        "Go to your profile, click 'Post Ad', fill in your product details, add photos, set your price, and publish. Your ad will be live immediately!",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We support mobile money (Airtel Money, MTN Money), bank transfers, and payment cards. Choose the method that works best for you.",
    },
    {
      question: "How safe is my information?",
      answer:
        "Oysloe uses industry-standard encryption to protect your personal and financial information. We never share your data with third parties.",
    },
    {
      question: "What if there's a dispute with a buyer/seller?",
      answer:
        "Our support team is here to help! Contact us with details about the issue, and we'll work to resolve it fairly. We also have a rating system to help ensure trustworthy transactions.",
    },
    {
      question: "How do I become a verified seller?",
      answer:
        "Complete your profile, add a profile photo, verify your phone number, and make your first successful sale. Verified sellers get a badge and higher visibility.",
    },
    {
      question: "Can I sell internationally?",
      answer:
        "Currently, Oysloe operates within Ghana. You can sell to any buyer in Ghana with our platform.",
    },
    {
      question: "How long does a listing stay active?",
      answer:
        "Listings remain active for 30 days. You can renew them to keep them visible or take them down at any time.",
    },
    {
      question: "What should I do if I want to report a user?",
      answer:
        "You can report a user directly through their profile or contact our support team. We take all reports seriously and investigate promptly.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Oysloe</title>
        <meta
          name="description"
          content="Frequently asked questions about Oysloe - learn how to buy, sell, and use our platform."
        />
      </Helmet>
      <div className="relative flex items-center justify-center w-screen sm:w-full h-full text-center max-sm:pt-10">
        <div
          className={`
            shadow-lg rounded-2xl bg-white lg:h-[93vh] px-6 py-10 sm:px-5 max-lg:pt-0 sm:py-6 w-full 
            flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
            h-screen sm:h-auto overflow-auto no-scrollbar
          `}
        >
          <div className="flex lg:pt-15 px-5 flex-col justify-start gap-4 mb-2 w-full sm:h-[85vh] overflow-auto no-scrollbar">
            <h1 className="text-3xl sm:text-4xl font-bold text-(--dark-def) max-lg:pt-15 mb-4">
              Frequently Asked Questions
            </h1>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition cursor-pointer"
                >
                  <summary className="font-semibold text-(--dark-def) text-lg flex items-center justify-between">
                    {faq.question}
                    <span className="ml-2">+</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-left">{faq.answer}</p>
                </details>
              ))}
            </div>

            {/* Contact Support */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold text-(--dark-def) mb-2">
                Can't find your answer?
              </h2>
              <p className="text-gray-600 mb-4">
                Our support team is here to help. Send us a message and we'll get back to you as soon as possible.
              </p>
              <a
                href="mailto:support@oysloe.com"
                className="inline-block bg-(--green) text-(--dark-def) px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Contact Support
              </a>
            </div>

            <p className="text-gray-500 text-sm mt-6 mb-10">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
