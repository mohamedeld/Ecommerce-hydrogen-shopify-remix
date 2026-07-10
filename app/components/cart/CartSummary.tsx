import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import clsx from 'clsx';
import {CreditCard, Gift} from 'lucide-react';
import {CartDiscounts} from './CartDiscounts';
import {CartGiftCard} from './CartGiftCard';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div
      aria-labelledby={summaryId}
      className={clsx('bg-white px-6 py-8 flex flex-col gap-4', className)}
    >
      <div className="flex items-center justify-between ">
        <span className="font-open-sans text-gray-600">Subtotal</span>
        <span className="font-open-sans font-medium">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Gift className="size-4" />
          <span>Complimentary gift wrapping available</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CreditCard className="size-4" />
          <span>Secure checkout powered by Shopify</span>
        </div>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a
        href={checkoutUrl}
        target="_self"
        className="inline-flex items-center justify-center w-full px-8 py-4  bg-navy text-white! font-open-sans font-medium hover:bg-navy-light hover:text-navy transition-colors duration-200 rounded-full"
      >
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}
