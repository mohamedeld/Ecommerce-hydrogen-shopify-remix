import React from 'react';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from './PaginatedResourceSection';
import {ProductItem} from './ProductItem';

type ProductGidProps = {
  products: any;
};

export const ProductGid = ({products}: ProductGidProps) => {
  return (
    <section className="bg-white py-16 md:py-23">
      <div className="container mx-auto">
        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
          resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {({node: product, index}) => (
            <ProductItem key={product.id} product={product} loading={'lazy'} />
          )}
        </PaginatedResourceSection>
      </div>
    </section>
  );
};
