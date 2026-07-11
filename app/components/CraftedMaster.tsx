import {Image} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import {Link} from 'react-router';

export const CraftedMaster = () => {
  return (
    <section className="px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/images/craftman.jpg"
              alt="Craftman"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="max-w-xl flex flex-col gap-6">
            <h2 className="font-playfair text-3xl! my-0!">
              Crafted by Master Artisans
            </h2>
            <p className="font-open-sans text-gray-600 mb-8 leading-relaxed">
              Every pair of our shoes is a testament to the skill and dedication
              of our master artisans. From the selection of premium materials to
              the meticulous handcrafting process, we ensure that each shoe
              meets the highest standards of quality and style.
            </p>
            <Link
              to="/pages/our-craft"
              className="inline-flex items-center text-navy hover:text-gold! transition-colors duration-300 font-open-sans font-medium"
            >
              Discover Our Process <ArrowRight className="ml-2 size-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
