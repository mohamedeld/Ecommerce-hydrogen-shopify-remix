import {Image} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import React from 'react';
import {Link} from 'react-router';

type HeroSectionProps = {isHome?: boolean; imgUrl?: string};
export const HeroSection = ({
  isHome,
  imgUrl = '/images/craftman1.jpg',
}: HeroSectionProps) => {
  return (
    <section className="relative h-screen min-h-150 bg-navy">
      <Image
        loading="eager"
        src={imgUrl}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        alt="Craftsman working on a piece of wood"
      />
      {!isHome && (
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy/80"></div>
      )}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl flex  flex-col gap-6 pt-16">
          <h1 className="my-0! text-4xl font-semibold font-playfair text-white md:text-6xl!">
            Artisinal Footwear for the modern sophisticate
          </h1>
          <p className="font-open-sans text-lg text-gray-200 mb-8">
            HandCrafted excellence, designed for distinction
          </p>
          {isHome && (
            <Link
              to="/collections/all"
              className="w-fit inline-flex items-center px-8 py-4 bg-gold hover:bg-gold-dark transition-colors duration-300 text-white! font-open-sans font-medium"
            >
              Explore Collection <ArrowRight className="size-5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
