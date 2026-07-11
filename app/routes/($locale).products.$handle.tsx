import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {RichText} from '@shopify/hydrogen';
import {ChevronDown} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="pt-48">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pb-16">
          <ProductImage
            image={selectedVariant?.image}
            images={product?.images?.nodes}
          />
          <div className="flex flex-col gap-6">
            <h1 className="my-0! font-playfair text-3xl! md:text-4xl! lg:text-5xl! text-navy">
              {title}
            </h1>
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
            <div className="font-open-sans text-navy/80 max-w-none">
              <p className="font-open-sans text-navy/80 mb-2! ">
                <strong>Description</strong>
              </p>
              <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
            </div>
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />
            <div className="mt-6 border-t border-navy/10">
              <div className="grid grid-cols-1 divide-y divide-navy/10">
                {product?.materials?.value && (
                  <details className="group py-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="font-playfair text-lg text-navy">
                        {' '}
                        Material & Construction
                      </h3>
                      <span className="relative shrink-0 ml-4 w-4 h-4 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown />
                      </span>
                    </summary>
                    <div className="pt-4 prose font-open-sans text-navy/80">
                      <RichText data={product?.materials?.value} />
                      {product?.construction?.value && (
                        <div className="mt-4">
                          <h4 className="font-playfair text-base text-navy">
                            Construction
                          </h4>
                          <p>{product?.construction?.value}</p>
                        </div>
                      )}
                    </div>
                  </details>
                )}
                {product?.sizingNotes?.value && (
                  <details className="group py-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="font-playfair text-lg text-navy">
                        Size & Fit
                      </h3>
                      <span className="relative shrink-0 ml-4 w-4 h-4 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown />
                      </span>
                    </summary>
                    <div className="pt-4 prose font-open-sans text-navy/80">
                      <p>{product?.sizingNotes?.value}</p>
                    </div>
                  </details>
                )}
                {product?.careInstructions?.value && (
                  <details className="group py-6">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="font-playfair text-lg text-navy">
                        Care Instructions
                      </h3>
                      <span className="relative shrink-0 ml-4 w-4 h-4 transition-transform duration-300 group-open:rotate-180">
                        <ChevronDown />
                      </span>
                    </summary>
                    <div className="pt-4 prose font-open-sans text-navy/80">
                      <RichText data={product?.careInstructions?.value} />
                    </div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    careInstructions: metafield(namespace: "custom", key: "care_instructions") {
      value
    }
    materials: metafield(namespace: "custom", key: "materials") {
      value
    }
    construction: metafield(namespace: "custom", key: "construction") {
      value
    }
    sizingNotes: metafield(namespace: "custom", key: "sizing_notes") {
      value
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
