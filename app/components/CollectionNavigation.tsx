export const CollectionNavigation = ({length}: {length: number}) => {
  return (
    <div className="bg-cream border-y border-navy/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="my-0! font-playfair text-2xl! text-navy">
              The Collection
            </h2>
            <p className="font-open-sans text-navy/60">
              Showing {length} Handcrafted pieces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="font-open-sans text-sm text-navy/60 hover:text-navy transition-colors ">
              Filter
            </button>
            <button className="font-open-sans text-sm text-navy/60 hover:text-navy transition-colors ">
              Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
