import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useProducts } from '../helpers/useProducts';
import { ProductCard } from '../components/ProductCard';
import { productToDbFormat } from '../helpers/convertProduct';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { Button } from '../components/Button';
import styles from './_index.module.css';

const priceFilters = [
  { label: 'Under ₹999', value: 'under-999' },
  { label: '₹999 - ₹1,499', value: '999-1499' },
  { label: '₹1,500 - ₹2,499', value: '1500-2499' },
  { label: 'Above ₹2,499', value: 'above-2499' },
];

const brandLogos = [
    // Placeholder logos
    { name: 'NIKE', path: '/logos/brand-a.svg' },
    { name: 'REEBOK', path: '/logos/brand-b.svg' },
    { name: 'NEW BALENCE', path: '/logos/brand-c.svg' },
    { name: 'CONVERCE', path: '/logos/brand-d.svg' },
    { name: 'CROCS', path: '/logos/brand-e.svg' },
];

const IndexPage = () => {
  const { data, isFetching, error } = useProducts();

  return (
    <>
      <Helmet>
        <title>CHAMP | Curated Luxury Footwear</title>
        <meta name="description" content="Discover exclusive, authenticated luxury sneakers and shoes from the world's top brands. CHAMP is your destination for rare and high-end footwear." />
      </Helmet>
      <div className={styles.pageContainer}>
        <header className={styles.hero}>
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80"
            alt="Luxury sneaker on display"
            className={styles.heroImage}
          />
        </header>

        <section className={styles.brandsSection}>
            <h3 className={styles.brandsTitle}>As Seen From</h3>
            <div className={styles.brandsReel}>
                <div className={styles.brandsTrack}>
                    {[...brandLogos, ...brandLogos].map((logo, index) => (
                        <div key={index} className={styles.brandLogo}>
                            {/* In a real app, these would be actual SVG logos */}
                            <span className={styles.brandText}>{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className={styles.priceSection}>
            <h2 className={styles.sectionTitle}>Shop by Price</h2>
            <div className={styles.priceGrid}>
                {priceFilters.map(filter => (
                    <Link key={filter.value} to={`/products?priceRange=${filter.value}`} className={styles.priceCard}>
                        <span className={styles.priceLabel}>{filter.label}</span>
                        <ArrowRight className={styles.priceIcon} size={24} />
                    </Link>
                ))}
            </div>
        </section>

        <section className={styles.featuredSection}>
          <div className={styles.featuredHeader}>
            <h2 className={styles.sectionTitle}>Featured Arrivals</h2>
            <Button asChild variant="outline">
              <Link to="/products">View All <ArrowRight size={16} /></Link>
            </Button>
          </div>
          <div className={styles.productGrid}>
            {isFetching ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : error ? (
              <div className={styles.errorState}>
                <p>Could not load featured products.</p>
              </div>
            ) : (
              data?.products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={productToDbFormat(product)} />
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default IndexPage;