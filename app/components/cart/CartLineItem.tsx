import type {CartLayout, LineItemChildrenMap} from '~/components/cart/CartMain';
import {Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from '../ProductPrice';
import {useAside} from '../Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartLineRemoveButton} from './CartLineRemoveButton';
import {CartLineQuantity} from './CartLineQuantity';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100" key={id}>
      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            className="object-cover w-full h-full"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="block"
          >
            <h3 className="font-playfair text-base text-navy mb-1 truncate">
              {title}
            </h3>
          </Link>
          <CartLineRemoveButton
            lineIds={[line?.id]}
            disabled={!!line?.isOptimistic}
          />
        </div>

        <ul className="flex flex-col gap-1">
          {selectedOptions.map((option) => (
            <li
              key={option.name}
              className="font-open-sans text-sm text-gray-500"
            >
              {option.name}: {option.value}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <CartLineQuantity line={line} />
          <div className="font-open-sans font-medium">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}

// <li key={id} className="cart-line">
//   <div className="cart-line-inner">
//     {image && (
//       <Image
//         alt={title}
//         aspectRatio="1/1"
//         data={image}
//         height={100}
//         loading="lazy"
//         width={100}
//       />
//     )}

//     <div>
//       <Link
//         prefetch="intent"
//         to={lineItemUrl}
//         onClick={() => {
//           if (layout === 'aside') {
//             close();
//           }
//         }}
//       >
//         <p>
//           <strong>{product.title}</strong>
//         </p>
//       </Link>
//       <ProductPrice price={line?.cost?.totalAmount} />
//       <ul>
//         {selectedOptions.map((option) => (
//           <li key={option.name}>
//             <small>
//               {option.name}: {option.value}
//             </small>
//           </li>
//         ))}
//       </ul>
//       <CartLineQuantity line={line} />
//     </div>
//   </div>

//   {lineItemChildren ? (
//     <div>
//       <p id={childrenLabelId} className="sr-only">
//         Line items with {product.title}
//       </p>
//       <ul aria-labelledby={childrenLabelId} className="cart-line-children">
//         {lineItemChildren.map((childLine) => (
//           <CartLineItem
//             childrenMap={childrenMap}
//             key={childLine.id}
//             line={childLine}
//             layout={layout}
//           />
//         ))}
//       </ul>
//     </div>
//   ) : null}
// </li>
