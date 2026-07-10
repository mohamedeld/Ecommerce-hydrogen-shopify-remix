import {CartForm} from '@shopify/hydrogen';
import {Trash} from 'lucide-react';
import {getUpdateKey} from '~/lib/utils/getUpdateKey';

export function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        <Trash className="size-5 text-red-500" />
      </button>
    </CartForm>
  );
}
