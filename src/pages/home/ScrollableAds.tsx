import React from "react";
import type { Category } from "../../types/Category";
import type { Product } from "../../types/Product";
import ScrollableAdRow from "./ScrollableAdRow";
import LoadingDots from "../../components/LoadingDots";

type Props = {
  categories: Category[];
  productsByCategory: Record<number, Product[]>;
  applyFilters: (p: Product[]) => Product[];
  productsLoading: boolean;
  handleArrowClick: (dir: "left" | "right", id: string | number) => void;
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const ScrollableAds = ({
  categories,
  productsByCategory,
  applyFilters,
  productsLoading,
  handleArrowClick,
  handleAdClick,
}: Props) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
        <img
          src="/nothing-to-show.png"
          alt="Nothing to show"
          className="max-w-[50vw] sm:max-w-50"
        />
        <p>No ad categories are available at this time.</p>
      </div>
    );
  }

  // Filter out categories that have no filtered products
  const categoriesWithAds = categories.filter((category) => {
    const categoryProducts = productsByCategory[category.id] || [];
    const filteredProducts = applyFilters(categoryProducts);
    return filteredProducts.length > 0;
  });

  // Show loading state while products are being fetched
  if (productsLoading) {
    return (
      <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
        <LoadingDots />
      </div>
    );
  }

  if (categoriesWithAds.length === 0) {
    return (
      <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
        <img
          src="/nothing-to-show.png"
          alt="Nothing to show"
          className="max-w-[50vw] sm:max-w-50"
        />
        <p>No ads match your filters.</p>
      </div>
    );
  }

  return (
    <>
      {categoriesWithAds.map((category) => (
        <ScrollableAdRow
          key={category.id}
          category={category}
          productsByCategory={productsByCategory}
          applyFilters={applyFilters}
          productsLoading={productsLoading}
          handleArrowClick={handleArrowClick}
          handleAdClick={handleAdClick}
        />
      ))}
    </>
  );
};

export default ScrollableAds;
