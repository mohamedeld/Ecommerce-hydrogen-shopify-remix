import React, {useState, useEffect} from 'react';
import {useNavigate, useFetcher} from 'react-router';
import type {Route} from './+types/contact._index';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type InquiryType = 'general' | 'bespoke' | 'order' | 'feedback';

interface FormState {
  formStatus: FormStatus;
  inquiryType: InquiryType;
  errorMessage?: string;
  successMessage?: string;
}

// Action for form submission
export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const inquiryType = formData.get('inquiryType') as InquiryType;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;
  const orderNumber = formData.get('orderNumber') as string;

  // Validate required fields
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({error: 'Please fill in all required fields'}),
      {status: 400, headers: {'Content-Type': 'application/json'}},
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({error: 'Please enter a valid email address'}),
      {status: 400, headers: {'Content-Type': 'application/json'}},
    );
  }

  try {
    // Log the data (replace with actual email sending logic)
    console.log('Contact form submission:', {
      inquiryType,
      name,
      email,
      phone,
      message,
      orderNumber,
    });

    // You can add your email sending logic here
    // For example, using a third-party service
    // const emailResponse = await fetch('https://your-email-service.com/send', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({inquiryType, name, email, phone, message, orderNumber})
    // });

    // Return success
    return new Response(
      JSON.stringify({success: 'Your message has been sent successfully!'}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return new Response(
      JSON.stringify({error: 'Failed to send message. Please try again.'}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
}

const ContactPage = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [formState, setFormState] = useState<FormState>({
    formStatus: 'idle',
    inquiryType: 'general',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    orderNumber: '',
  });

  // Monitor fetcher state changes
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      const result = fetcher.data as {success?: string; error?: string};

      if (result.success) {
        setFormState((prev) => ({
          ...prev,
          formStatus: 'success',
          successMessage: result.success,
        }));
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          orderNumber: '',
        });
        setTimeout(() => navigate('/'), 3000);
      } else if (result.error) {
        setFormState((prev) => ({
          ...prev,
          formStatus: 'error',
          errorMessage: result.error,
        }));
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setFormState({
      ...formState,
      formStatus: 'submitting',
      errorMessage: undefined,
      successMessage: undefined,
    });
  };

  const handleInquiryTypeChange = (type: InquiryType) => {
    setFormState((prev) => ({...prev, inquiryType: type}));
  };

  const renderSuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="font-playfair text-2xl text-green-800 mb-2">Thank You!</h3>
      <p className="font-open-sans text-green-700">
        {formState.successMessage ||
          "Your message has been sent successfully. We'll get back to you soon."}
      </p>
    </div>
  );

  const renderErrorMessage = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="font-open-sans text-red-700">{formState.errorMessage}</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="bg-navy py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="font-playfair text-2xl md:text-3xl! my-0! text-white">
              Contact Us
            </h1>
            <p className="font-open-sans text-lg md:text-xl text-cream max-w-2xl mx-auto">
              We value your feedback and inquiries. Please fill out the form
              below, and our team will get back to you as soon as possible.
              Whether you have questions about our products, need assistance
              with an order, or want to share your thoughts, we&apos;re here to
              help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-cream/30">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            {formState.formStatus === 'success' ? (
              renderSuccessMessage()
            ) : (
              <fetcher.Form
                method="POST"
                className="space-y-6 max-w-[100vw]!"
                onSubmit={handleSubmit}
              >
                {formState.formStatus === 'error' && renderErrorMessage()}

                {/* Inquiry Type Selection */}
                <div>
                  <label className="block font-playfair text-lg text-navy mb-3">
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['general', 'bespoke', 'order', 'feedback'] as const).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInquiryTypeChange(type)}
                          className={`px-4 py-2 rounded-lg text-sm font-open-sans transition-colors ${
                            formState.inquiryType === type
                              ? 'bg-gold text-white'
                              : 'bg-navy/5 text-navy hover:bg-navy/10'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                  <input
                    type="hidden"
                    name="inquiryType"
                    value={formState.inquiryType}
                  />
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-open-sans text-navy mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-navy/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-open-sans text-navy mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-navy/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-open-sans text-navy mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-navy/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Order Number (conditional) */}
                {formState.inquiryType === 'order' && (
                  <div>
                    <label
                      htmlFor="orderNumber"
                      className="block font-open-sans text-navy mb-2"
                    >
                      Order Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="orderNumber"
                      name="orderNumber"
                      type="text"
                      value={formData.orderNumber}
                      onChange={handleInputChange}
                      required={formState.inquiryType === 'order'}
                      className="w-full px-4 py-3 rounded-lg border border-navy/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                      placeholder="Order #12345"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block font-open-sans text-navy mb-2"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-navy/20 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors resize-y"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
                  <p className="font-open-sans text-sm text-navy/60">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={formState.formStatus === 'submitting'}
                    className="px-8 py-3 bg-gold text-white font-open-sans font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
                  >
                    {formState.formStatus === 'submitting' ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </fetcher.Form>
            )}
          </div>

          {/* Contact Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-playfair text-navy mb-1">Email Us</h4>
              <p className="font-open-sans text-sm text-navy/60">
                support@craftsmanship.com
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h4 className="font-playfair text-navy mb-1">Call Us</h4>
              <p className="font-open-sans text-sm text-navy/60">
                +1 (555) 123-4567
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="font-playfair text-navy mb-1">Visit Us</h4>
              <p className="font-open-sans text-sm text-navy/60">
                123 Craft Lane, Artisan City
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
