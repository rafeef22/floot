import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useProducts } from '../helpers/useProducts';
import { PriceRange, PriceRangeSchema, Brand, BrandSchema, Quality, QualitySchema, Size, SizeSchema } from '../endpoints/products_GET.schema';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { productToDbFormat } from '../helpers/convertProduct';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/Select';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { X, SlidersHorizontal, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/Sheet';
import styles from './products.module.css';

const filterOptions = {
  priceRange: [
    { label: 'Under ₹999', value: 'under-999' as PriceRange },
    { label: 'Under ₹1,499', value: 'under-1499' as PriceRange },
    { label: 'Under ₹1,999', value: 'under-1999' as PriceRange },
    { label: 'Under ₹2,499', value: 'under-2499' as PriceRange },
    { label: 'Above ₹2,499', value: 'above-2499' as PriceRange },
  ],
  brand: [
    { label: 'Nike', value: 'nike' as Brand },
    { label: 'Adidas', value: 'adidas' as Brand },
    { label: 'Puma', value: 'puma' as Brand },
    { label: 'Reebok', value: 'reebok' as Brand },
    { label: 'Yeezy', value: 'yeezy' as Brand },
    { label: 'Others', value: 'others' as Brand },
  ],
  size: [
    { label: '6', value: '6' as Size },
    { label: '7', value: '7' as Size },
    { label: '8', value: '8' as Size },
    { label: '9', value: '9' as Size },
    { label: '10', value: '10' as Size },
    { label: '11', value: '11' as Size },
  ],

  quality: [
    { label: '10A (Highest Quality)', value: '10a' as Quality },
    { label: '9A', value: '9a' as Quality },
    { label: '7A', value: '7a' as Quality },
    { label: '6A', value: '6a' as Quality },
    { label: '5A', value: '5a' as Quality },
  ],
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });
  
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | undefined>(() => {
    const param = searchParams.get('priceRange');
    const parsed = PriceRangeSchema.safeParse(param);
    return parsed.success ? parsed.data : undefined;
  });

  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(() => {
    const param = searchParams.get('brand');
    const parsed = BrandSchema.safeParse(param);
    return parsed.success ? parsed.data : undefined;
  });

  const [selectedSize, setSelectedSize] = useState<Size | undefined>(() => {
    const param = searchParams.get('size');
    const parsed = SizeSchema.safeParse(param);
    return parsed.success ? parsed.data : undefined;
  });



  const [selectedQuality, setSelectedQuality] = useState<Quality | undefined>(() => {
    const param = searchParams.get('quality');
    const parsed = QualitySchema.safeParse(param);
    return parsed.success ? parsed.data : undefined;
  });

  const { data, isFetching, error } = useProducts({ 
    priceRange: selectedPriceRange,
    brand: selectedBrand,
    size: selectedSize,
    quality: selectedQuality,
    search: searchQuery || undefined
  });

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      newSearchParams.set('search', searchQuery.trim());
    } else {
      newSearchParams.delete('search');
    }
    
    if (selectedPriceRange) {
      newSearchParams.set('priceRange', selectedPriceRange);
    } else {
      newSearchParams.delete('priceRange');
    }
    
    if (selectedBrand) {
      newSearchParams.set('brand', selectedBrand);
    } else {
      newSearchParams.delete('brand');
    }
    
    if (selectedSize) {
      newSearchParams.set('size', selectedSize);
    } else {
      newSearchParams.delete('size');
    }
    

    if (selectedQuality) {
      newSearchParams.set('quality', selectedQuality);
    } else {
      newSearchParams.delete('quality');
    }
    
    setSearchParams(newSearchParams, { replace: true });
  }, [searchQuery, selectedPriceRange, selectedBrand, selectedSize, selectedQuality, setSearchParams]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriceRange(undefined);
    setSelectedBrand(undefined);
    setSelectedSize(undefined);
    setSelectedQuality(undefined);
  };

  const getActiveFilters = () => {
    const active = [];
    if (searchQuery.trim()) {
      active.push({ type: 'Search', label: `"${searchQuery.trim()}"`, value: searchQuery, clear: () => setSearchQuery('') });
    }
    if (selectedPriceRange) {
      const filter = filterOptions.priceRange.find(f => f.value === selectedPriceRange);
      if (filter) active.push({ type: 'Price', label: filter.label, value: selectedPriceRange, clear: () => setSelectedPriceRange(undefined) });
    }
    if (selectedBrand) {
      const filter = filterOptions.brand.find(f => f.value === selectedBrand);
      if (filter) active.push({ type: 'Brand', label: filter.label, value: selectedBrand, clear: () => setSelectedBrand(undefined) });
    }
    if (selectedSize) {
      const filter = filterOptions.size.find(f => f.value === selectedSize);
      if (filter) active.push({ type: 'Size', label: `Size ${filter.label}`, value: selectedSize, clear: () => setSelectedSize(undefined) });
    }

    if (selectedQuality) {
      const filter = filterOptions.quality.find(f => f.value === selectedQuality);
      if (filter) active.push({ type: 'Quality', label: filter.label, value: selectedQuality, clear: () => setSelectedQuality(undefined) });
    }
    return active;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <>
      <Helmet>
        <title>Collection | CHAMP</title>
        <meta name="description" content="Explore the full collection of luxury and rare sneakers at CHAMP. Filter by price, brand, size, color, and condition to find your perfect pair." />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.searchSection}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <Input
              type="search"
              placeholder="Search for shoes, brands, or styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.filterSection}>
          {/* Mobile Filter Button */}
          <div className={styles.mobileFilterButton}>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className={styles.filterTriggerButton}>
                  <SlidersHorizontal size={16} />
                  Filter
                  {hasActiveFilters && (
                    <span className={styles.filterBadge}>{activeFilters.length}</span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className={styles.mobileFilterSheet}>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className={styles.mobileFilterContent}>
                  <div className={styles.mobileFilterGrid}>
                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Price Range</label>
                      <Select onValueChange={(value) => setSelectedPriceRange(value === '__empty' ? undefined : value as PriceRange)} value={selectedPriceRange || '__empty'}>
                        <SelectTrigger className={styles.selectTrigger}>
                          <SelectValue placeholder="Any price" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__empty">Any price</SelectItem>
                          {filterOptions.priceRange.map(filter => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Brand</label>
                      <Select onValueChange={(value) => setSelectedBrand(value === '__empty' ? undefined : value as Brand)} value={selectedBrand || '__empty'}>
                        <SelectTrigger className={styles.selectTrigger}>
                          <SelectValue placeholder="Any brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__empty">Any brand</SelectItem>
                          {filterOptions.brand.map(filter => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Size</label>
                      <Select onValueChange={(value) => setSelectedSize(value === '__empty' ? undefined : value as Size)} value={selectedSize || '__empty'}>
                        <SelectTrigger className={styles.selectTrigger}>
                          <SelectValue placeholder="Any size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__empty">Any size</SelectItem>
                          {filterOptions.size.map(filter => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Quality</label>
                      <Select onValueChange={(value) => setSelectedQuality(value === '__empty' ? undefined : value as Quality)} value={selectedQuality || '__empty'}>
                        <SelectTrigger className={styles.selectTrigger}>
                          <SelectValue placeholder="Any quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__empty">Any quality</SelectItem>
                          {filterOptions.quality.map(filter => (
                            <SelectItem key={filter.value} value={filter.value}>
                              {filter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className={styles.mobileActiveFilters}>
                      <div className={styles.activeFiltersHeader}>
                        <span className={styles.activeFiltersTitle}>Active Filters ({activeFilters.length})</span>
                        <Button variant="ghost" size="sm" onClick={handleResetFilters} className={styles.resetButton}>
                          Reset All
                        </Button>
                      </div>
                      <div className={styles.activeFiltersList}>
                        {activeFilters.map((filter, index) => (
                          <div key={`${filter.type}-${filter.value}`} className={styles.activeFilter}>
                            <span className={styles.activeFilterText}>{filter.label}</span>
                            <button onClick={filter.clear} className={styles.removeFilter} aria-label={`Remove ${filter.label} filter`}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.mobileFilterActions}>
                    <Button variant="outline" onClick={() => setIsFilterSheetOpen(false)} className={styles.closeFilterButton}>
                      Close
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Grid */}
          <div className={styles.filterGrid}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range</label>
              <Select onValueChange={(value) => setSelectedPriceRange(value === '__empty' ? undefined : value as PriceRange)} value={selectedPriceRange || '__empty'}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Any price</SelectItem>
                  {filterOptions.priceRange.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Brand</label>
              <Select onValueChange={(value) => setSelectedBrand(value === '__empty' ? undefined : value as Brand)} value={selectedBrand || '__empty'}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Any brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Any brand</SelectItem>
                  {filterOptions.brand.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Size</label>
              <Select onValueChange={(value) => setSelectedSize(value === '__empty' ? undefined : value as Size)} value={selectedSize || '__empty'}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Any size</SelectItem>
                  {filterOptions.size.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Quality</label>
              <Select onValueChange={(value) => setSelectedQuality(value === '__empty' ? undefined : value as Quality)} value={selectedQuality || '__empty'}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Any quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__empty">Any quality</SelectItem>
                  {filterOptions.quality.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              <div className={styles.activeFiltersHeader}>
                <span className={styles.activeFiltersTitle}>Active Filters ({activeFilters.length})</span>
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className={styles.resetButton}>
                  Reset All
                </Button>
              </div>
              <div className={styles.activeFiltersList}>
                {activeFilters.map((filter, index) => (
                  <div key={`${filter.type}-${filter.value}`} className={styles.activeFilter}>
                    <span className={styles.activeFilterText}>{filter.label}</span>
                    <button onClick={filter.clear} className={styles.removeFilter} aria-label={`Remove ${filter.label} filter`}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <main className={styles.main}>
          {isFetching ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <h2>Something went wrong</h2>
              <p>We couldn't load the products. Please try again later.</p>
            </div>
          ) : data?.products.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No Results Found</h2>
              <p>
                {hasActiveFilters 
                  ? "No products match your current filter selection. Try adjusting your filters."
                  : "No products are currently available."
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleResetFilters} className={styles.resetEmptyButton}>
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <div className={styles.grid}>
              {data?.products.map(product => (
                <ProductCard key={product.id} product={productToDbFormat(product)} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ProductsPage;