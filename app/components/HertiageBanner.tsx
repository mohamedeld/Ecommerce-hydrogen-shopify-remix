import React from 'react';

export const HertiageBanner = () => {
  return (
    <section className="bg-cream py-16 md:py-23">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col gap-6">
            <h3 className="my-0! font-playfair text-2xl! md:text-3xl! text-navy ">
              A Legacy of Distinction
            </h3>
            <p className="font-open-sans text-navy/80">
              Our heritage is built on a foundation of quality, craftsmanship,
              and innovation. We take pride in our legacy and continue to uphold
              the highest standards in everything we do.
            </p>
            <p className="font-open-sans text-navy/60 text-sm">
              Available for a limited time only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
