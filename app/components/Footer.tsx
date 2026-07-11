import {Image} from '@shopify/hydrogen';
import {ShopPayButton} from '@shopify/hydrogen';
import {Mail, MapIcon, Phone} from 'lucide-react';
import {Suspense} from 'react';
import {Await, Form, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const {shop} = header;

  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-navy text-white">
            <div className="border-b border-white/10">
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-xl mx-auto text-center flex flex-col gap-4 justify-center items-center">
                  <h2 className="font-playfair text-2xl ">
                    Join the Artisans Article
                  </h2>
                  <p className="font-open-sans text-sm text-white/70 ">
                    Sign up for our newsletter to receive the latest news and
                    updates from our team.
                  </p>
                  <Form
                    method="post"
                    action="/newsletter-signup"
                    className="flex flex-col sm:flex-row w-full! gap-2  items-center"
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-gold text-white px-4 py-2 rounded h-10"
                    >
                      Subscribe
                    </button>
                  </Form>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-playfair">{shop.name}</h3>
                  <p className="font-open-sans text-sm text-gray-300 leading-relaxed">
                    Artisinal products crafted with care and passion. Explore
                    our collection of unique items that tell a story.
                  </p>
                  <div className="flex space-x-4 mt-6">
                    <a
                      href="https://facebook.com"
                      className="text-white hover:text-gold"
                    >
                      <Image
                        src="/images/facebook.svg"

                        className="size-6 text-white/20"
                      />
                    </a>
                    <a
                      href="https://twitter.com"
                      className="text-white hover:text-gold"
                    >
                      <Image
                        src="/images/twitter.svg"

                        className="size-6 text-white/20"
                      />
                    </a>
                    <a
                      href="https://instagram.com"
                      className="text-white hover:text-gold"
                    >
                      <Image
                        src="/images/linkedin.svg"

                        className="size-6 text-white/80 fill-white"
                      />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <h4 className="font-playfair text-lg">Contact</h4>
                  <ul className="flex flex-col gap-4 font-open-sans text-sm text-gray-400">
                    <li className="flex items-start space-x-3">
                      <MapIcon className="size-5 text-gold shrink-0" />
                      <span>
                        123 Artisans Street, Craftsville <br /> Luxury District,
                        NY 10001
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Phone className="size-5 text-gold shrink-0" />
                      <span>+20 105544785</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Mail className="size-5 text-gold shrink-0" />
                      <span>contact@artisansarticle.com</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <h4 className="font-playfair text-lg">Quick Links</h4>
                  <ul className="flex flex-col gap-4 font-open-sans text-sm text-gray-400">
                    <li>
                      <NavLink
                        to="/collections/all"
                        className="text-gray-300! hover:text-gold! transition-colors duration-300"
                      >
                        Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/pages/our-craft"
                        className="text-gray-300! hover:text-gold! transition-colors duration-300"
                      >
                        Our Craft
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/pages/care-guide"
                        className="text-gray-300! hover:text-gold! transition-colors duration-300"
                      >
                        Care Guide
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/pages/about-us"
                        className="text-gray-300! hover:text-gold! transition-colors duration-300"
                      >
                        About US
                      </NavLink>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-6">
                  <h4 className="font-playfair text-lg">Policies</h4>
                  <FooterMenu
                    menu={footer?.menu}
                    primaryDomainUrl={header.shop.primaryDomain?.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
                  <p className="font-open-sans text-sm text-gray-400">
                    Copyright © {new Date().getFullYear()} Artisans Article. All
                    rights reserved.
                  </p>
                  <p className="font-open-sans text-sm text-gray-400">
                    Crafted with ❤️ by Artisans Article
                  </p>
                </div>
              </div>
            </div>
            {/* {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )} */}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="flex flex-col gap-3" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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
    color: isPending ? 'grey' : 'white',
  };
}
