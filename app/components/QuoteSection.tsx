import {Star} from 'lucide-react';

export const QuoteSection = () => {
  return (
    <section className="px-4 bg-navy text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          {Array.from({length: 5}).map((_, index) => (
            <Star
              key={`star-${index}`}
              fill="#c3a343"
              color="#c3a343"
              className="size-8 mb-8"
            />
          ))}
        </div>
        <blockquote className="font-playfair text-2xl md:text-3xl mb-8">
          &quot;I have been a loyal customer for years, and I can confidently
          say that this brand has never disappointed me. The quality of their
          products is unmatched, and the attention to detail is evident in every
          piece. I highly recommend them to anyone looking for timeless,
          well-crafted items.&quot;
        </blockquote>
        <cite className="font-open-sans text-lg">- John Doe</cite>
      </div>
    </section>
  );
};
