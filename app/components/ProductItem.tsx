import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {ArrowRight} from 'lucide-react';

export type IProduct =
  CollectionItemFragment | ProductItemFragment | RecommendedProductFragment;

export function ProductItem({
  product,
  loading,
  hidePrice = false,
}: {
  product: IProduct;
  loading?: 'eager' | 'lazy';
  hidePrice?: boolean;
}) {
  const selectedOptions =
    'variants' in product
      ? product?.variants?.nodes?.at(0)?.selectedOptions
      : undefined;
  const variantUrl = useVariantUrl(product.handle, selectedOptions);
  const image = product.featuredImage;
  const secondImage = product.images?.nodes?.[1] || null;
  return (
    <Link
      className="group block relative"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-square overflow-hidden bg-cream mb-6">
        {image && (
          <>
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-center w-full h-full group-hover:scale-105 transition group-hover:opacity-0"
            />
            {secondImage && (
              <Image
                alt={secondImage.altText || product.title}
                aspectRatio="1/1"
                data={secondImage}
                loading={loading}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="absolute inset-0 opacity-0 object-cover object-center w-full h-full group-hover:scale-105 transition group-hover:opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/40 transition-colors duration-300" />{' '}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <div className="bg-white/90 backdrop-blur-sm py-3 mx-4 text-center">
                <span className="font-open-sans text-sm font-medium text-navy tracking-wide">
                  View Details
                </span>
              </div>
            </div>
          </>
        )}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="relative flex flex-col gap-3">
        <h4 className="font-playfair text-lg text-navy group-hover:text-gold transition-colors duration-500 my-0!">
          {product.title}
        </h4>
        <div className="flex justify-between items-baseline">
          {!hidePrice && (
            <small>
              <Money
                data={product.priceRange.minVariantPrice}
                className="font-open-sans text-gray-600 group-hover:text-gold transition-colors duration-500"
              />
            </small>
          )}
          <span className="font-open-sans text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-1">
            Explore <ArrowRight className="ml-1 size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
