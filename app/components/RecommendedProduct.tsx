import React, {Suspense} from 'react';
import {SuspenseProduct} from './SuspenseProduct';
import {Await} from 'react-router';
import {ProductItem, type IProduct} from './ProductItem';

export const RecommendedProduct = ({data}: {data: any}) => {
  return (
    <section className="px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="font-playfair text-3xl text-center mb-12">
          Our Latest Products
        </h2>
        <div>
          <Suspense fallback={<SuspenseProduct />}>
            <Await resolve={data.recommendedProducts}>
              {(response) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {response?.products?.nodes?.map((product: IProduct) => (
                    <ProductItem
                      key={product?.id}
                      product={product}
                      loading="lazy"
                      hidePrice={false}
                    />
                  ))}
                </div>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  );
};
