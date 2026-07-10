import {Link} from 'react-router';
import type {CartMainProps} from './CartMain';
import {useAside} from '../Aside';
import {ArrowRight, ShoppingBag} from 'lucide-react';

export function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();

  if (hidden) {
    return null;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      {/* Icon container with relative positioning */}
      <div className="relative mb-8">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-cream rounded-full scale-[1.8] blur-xl opacity-50" />

        {/* Icon - now properly positioned on top */}
        <div className="relative w-20 h-20 bg-cream rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-navy" />
        </div>
      </div>
      <div className="max-w-md space-y-4">
        <h2 className="font-playfair text-2xl text-navy">
          Your Shopping Cart is Empty
        </h2>
        <p className="font-open-sans text-gray-500 leading-relaxed">
          Discover our collection of handcrafted footwear where traditional
          artisanship meets contemporary design. Each pair is a testament to
          quality and style, waiting to be part of your journey.
        </p>

        <Link
          to="/collections/all"
          prefetch="intent"
          className="inline-flex items-center justify-center px-8 py-4 mt-6 bg-navy text-white! font-open-sans font-medium hover:bg-navy-light hover:text-navy transition-colors duration-200 rounded-full"
          onClick={close}
        >
          Explore Our Products
          <ArrowRight className="size-5 ml-2" />
        </Link>

        <div className="pt-8 space-y-3 border-t border-gray-100 mt-8">
          <p className="font-open-sans text-sm text-gray-400 uppercase tracking-wide">
            Featured Products
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/collections/all"
              onClick={close}
              prefetch="intent"
              className="text-gold! hover:text-gold-dark! transition-colors duration-300"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="text-sm text-gray-500 pt-6">
          <p className="font-open-sans">
            Need assistance? Contact our support team for help with your order.
          </p>
          <a
            href="mailto:mohamed.azoz20010@gmail.com"
            className="font-open-sans text-gold! hover:text-gold-dark! transition-colors duration-300"
          >
            mohamed.azoz20010@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
