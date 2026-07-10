import clsx from 'clsx';
import type {CartLine} from './CartLineItem';
import {CartLineUpdateButton} from './CartLineUpdateButton';

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
export function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity flex items-center gap-2">
      <small>Quantity: </small>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className={clsx(
            'w-8 h-8 flex items-center justify-center rounded border transition-colors',
            quantity <= 1
              ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-300'
              : 'border-gray-200 hover:bg-gray-400 text-gray-500',
          )}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateButton>
      <span className="flex text-sm">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className={clsx(
            'w-8 h-8 flex items-center justify-center rounded border transition-colors',
            isOptimistic
              ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-300'
              : 'border-gray-200 hover:bg-gray-400 text-gray-500',
          )}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      &nbsp;
    </div>
  );
}
