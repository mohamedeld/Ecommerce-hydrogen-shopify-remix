import {Suspense, useCallback, useEffect, useRef, useState, memo} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {clsx} from 'clsx';

import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingBag, User} from 'lucide-react';
interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

const SCROLL_THRESHOLD = 40; // px before we start hiding

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const {type: asideType} = useAside();

  // Single piece of state instead of 3 — and only updated when the
  // derived values actually change, so scroll ticks that don't cross
  // a boundary don't trigger a re-render at all.
  const [scrollState, setScrollState] = useState({
    isScrolled: false,
    isScrollingUp: false,
  });

  // Doesn't need to be state — it's write-only until compared on the
  // next tick, so a ref avoids a render on every scroll event.
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isScrolled = currentY > SCROLL_THRESHOLD;
        const isScrollingUp = currentY < lastScrollY.current;
        lastScrollY.current = currentY;
        ticking.current = false;

        setScrollState((prev) =>
          prev.isScrolled === isScrolled && prev.isScrollingUp === isScrollingUp
            ? prev // bail out, no re-render
            : {isScrolled, isScrollingUp},
        );
      });
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {isScrolled, isScrollingUp} = scrollState;

  // Only depends on the value it actually uses now.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--announcement-height',
      isScrolled ? '0px' : '40px',
    );
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');
  }, [isScrolled]);

  const hideHeader = !isScrollingUp && isScrolled && asideType === 'closed';

  return (
    <div
      className={`fixed w-full z-2 transition-transform duration-500 ease-in-out ${
        hideHeader ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-navy text-white ${isScrolled ? 'h-0' : 'h-10'}`}
      >
        <div className="container mx-auto text-center py-2.5 px-4">
          <p className="font-open-sans text-[13px] leading-tight sm:text-sm font-light tracking-wider">
            Complimentary Shipping on Orders Above $500
          </p>
        </div>
      </div>
      <header
        className={`transition-all duration-500 ease-in-out border-b ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-transparent' : 'bg-white border-gray-100'}`}
      >
        <div className="container mx-auto">
          <div
            className={`hidden max-[550px]:block text-center border-b border-gray-100 transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'}`}
          >
            <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
              <strong className="font-playfair font-normal uppercase text-lg tracking-wider ">
                {shop.name}
              </strong>
            </NavLink>
          </div>
          <div
            className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-in-out ${isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'}`}
          >
            <div className="lg:hidden">
              <HeaderMenuMobileToggle />
            </div>
            <NavLink
              prefetch="intent"
              to="/"
              className={`font-playfair tracking-wider text-center hidden min-[550px]:block absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left translation-all duration-300 ease-in-out ${isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[28px] uppercase'}`}
            >
              {shop.name}
            </NavLink>
            <div className="hidden lg:block flex-1 px-12">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
            <div className="flex items-center">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>
      {/* <header className="header">
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <strong>{shop.name}</strong>
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header> */}
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const baseClassName = 'nav-link-base';
  const desktopClassName =
    'flex items-center justify-center space-x-12 text-sm uppercase tracking-wider';
  const mobileClassName = 'flex flex-col px-6 gap-6 py-4 h-[90vh] ';

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <>
          <div className="flex flex-col gap-6">
            {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              return (
                <NavLink
                  className={({isActive, isPending}) =>
                    clsx(baseClassName, 'text-lg py-2 block', {
                      'text-gold!': isActive,
                      'text-navy': !isActive,
                      'opacity-50': isPending,
                    })
                  }
                  end
                  key={item.id}
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
          <div className="mt-auto border-t border-gray-100 py-6">
            <div className="space-y-4">
              <NavLink
                to="/account"
                className="flex items-center space-x-2 text-navy hover:text-gold "
              >
                <User className="size-5" />
                <span className="font-open-sans text-base">Account</span>
              </NavLink>
              <button
                onClick={() => {
                  close();
                }}
                className="flex items-center space-x-2 text-navy hover:text-gold w-full text-left"
              >
                <Search className="size-5" />
                <span className="font-open-sans text-base">Search</span>
              </button>
            </div>
          </div>
        </>
      )}
      {viewport === 'desktop' && (
        <>
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <NavLink
                className={({isActive, isPending}) =>
                  clsx(baseClassName, {
                    'text-gold!': isActive,
                    'text-navy': !isActive,
                    'opacity-50': isPending,
                  })
                }
                end
                key={item.id}
                onClick={close}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}
        </>
      )}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="flex items-center gap-2 sm:gap-3 lg:gap-8"
      role="navigation"
    >
      <SearchToggle />
      <div>
        <NavLink
          prefetch="intent"
          to="/account"
          className="nav-link-base p-2 -m-2"
        >
          <span className="sr-only">Account</span>
          <User className="size-6" />
        </NavLink>
      </div>
      <div className="pl-0 sm:pl-2">
        <CartToggle cart={cart} />
      </div>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  const handleClick = useCallback(() => open('mobile'), [open]);
  return (
    <button
      className="p-3 -ml-2 hover:text-gold transition-colors duration-200"
      onClick={handleClick}
    >
      <Menu className="size-6" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  const handleClick = useCallback(() => open('search'), [open]);
  return (
    <button
      className="p-2 hover:text-gold transition-colors duration-200"
      onClick={handleClick}
    >
      <Search className="size-6" />
    </button>
  );
}

// Pure and cheap — memoize so it doesn't re-render unless count changes,
// even though its parent (CartBanner) re-renders on analytics context updates.
const CartBadge = memo(function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      open('cart');
      publish('cart_viewed', {
        cart,
        prevCart,
        shop,
        url: window.location.href || '',
      } as CartViewPayload);
    },
    [open, publish, cart, prevCart, shop],
  );

  return (
    <button
      className="relative p-2 hover:text-gold transition-colors duration-200"
      onClick={handleClick}
    >
      <ShoppingBag className="size-5" />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-gold text-navy rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
});

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
