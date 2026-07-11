import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {useState} from 'react';

export function ProductImage({
  image,
  images,
}: {
  image: ProductVariantFragment['image'];
  images: Array<ProductVariantFragment['image']>;
}) {
  const [state, setState] = useState({
    selectedIndex: 0,
    modalOpen: false,
    modalIndex: 0,
    touchStart: 0,
    dragOffset: 0,
    isDragging: false,
  });

  if (!image) {
    return <div className="product-image" />;
  }
  const allImages = image
    ? [image, ...(images || []).filter((item) => item?.id !== image?.id)]
    : images;

  const openModal = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: true,
      modalIndex: index,
    }));
  };
  const closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      modalOpen: false,
    }));
  };

  const handleSwipeEnd = () => {
    const swipeThreshold = 60;

    setState((prevState) => {
      let nextModalIndex = prevState.modalIndex;

      if (prevState.dragOffset > swipeThreshold) {
        nextModalIndex =
          (prevState.modalIndex - 1 + allImages.length) % allImages.length;
      } else if (prevState.dragOffset < -swipeThreshold) {
        nextModalIndex = (prevState.modalIndex + 1) % allImages.length;
      }

      return {
        ...prevState,
        modalIndex: nextModalIndex,
        touchStart: 0,
        dragOffset: 0,
        isDragging: false,
      };
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = e.touches[0]?.clientX ?? 0;
    setState((prevState) => ({
      ...prevState,
      touchStart: startX,
      dragOffset: 0,
      isDragging: true,
    }));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentX = e.touches[0]?.clientX ?? 0;
    setState((prevState) => {
      if (!prevState.isDragging) return prevState;

      return {
        ...prevState,
        dragOffset: currentX - prevState.touchStart,
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setState((prevState) => ({
      ...prevState,
      touchStart: e.clientX,
      dragOffset: 0,
      isDragging: true,
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setState((prevState) => {
      if (!prevState.isDragging) return prevState;

      return {
        ...prevState,
        dragOffset: e.clientX - prevState.touchStart,
      };
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square overflow-hidden bg-cream">
          {allImages[state.selectedIndex] && (
            <Image
              alt={allImages[state.selectedIndex]?.altText || 'Product Image'}
              aspectRatio="1/1"
              data={allImages[state.selectedIndex]!}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-center w-full h-full"
              onClick={() => openModal(state.selectedIndex)}
            />
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {allImages.map((img, index) => (
            <button
              key={img?.id || index}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden bg-cream cursor-pointer ${state.selectedIndex === index ? 'ring-2 ring-gold' : ''}`}
              onClick={() =>
                setState((prevState) => ({...prevState, selectedIndex: index}))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setState((prevState) => ({
                    ...prevState,
                    selectedIndex: index,
                  }));
                }
              }}
            >
              {img && (
                <Image
                  alt={img?.altText || 'Product Thumbnail'}
                  aspectRatio="1/1"
                  data={img}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-center w-full h-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      {state.modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeModal();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleSwipeEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleSwipeEnd}
            onMouseLeave={handleSwipeEnd}
          >
            <Image
              alt={allImages[state.modalIndex]?.altText || 'Product Image'}
              aspectRatio="1/1"
              data={allImages[state.modalIndex]!}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-center w-full h-full"
              style={{
                transform: `translateX(${state.dragOffset}px)`,
                transition: state.isDragging ? 'none' : 'transform 200ms ease',
              }}
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
