"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { EmptyState } from "@/components/common/empty-state";

interface CategorySectionProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySelector = React.memo<CategorySectionProps>(
  ({ categories, activeCategory, onSelectCategory }) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);

    const updateScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    React.useEffect(() => {
      updateScrollButtons();
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);
        return () => {
          container.removeEventListener("scroll", updateScrollButtons);
          window.removeEventListener("resize", updateScrollButtons);
        };
      }
    }, []);

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const scrollAmount = 300;
        scrollContainerRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    if (categories.length === 0) {
      return (
        <EmptyState
          icon="LayoutGrid"
          title="Nenhuma categoria encontrada"
          description="Adicione categorias para começar a vender."
        />
      );
    }

    return (
      <div className="w-full mb-2 relative group">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-test-full hidden md:flex "
            onClick={() => scroll("left")}
          >
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide pb-4 -mb-4 flex space-x-4 p-1 scroll-smooth"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "flex items-center justify-center px-6 py-2.5 rounded-[8px] transition-all min-w-[120px] shrink-0 text-sm font-semibold whitespace-nowrap",
                  activeCategory === category.id
                    ? "border-[1px] border-primary dark:text-white shadow-sm ring-1 ring-white/10"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70 border-none dark:bg-[#1F1F1F] dark:text-zinc-400 dark:hover:text-white dark:hover:bg-[#2A2A2A]/80",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-test-full hidden md:flex"
            onClick={() => scroll("right")}
          >
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);
