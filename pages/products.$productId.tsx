import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useProduct } from '../helpers/useProducts';
import { useSettings } from '../helpers/useSettings';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { ProductDetailsSkeleton } from '../components/ProductDetailsSkeleton';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { YoutubeEmbed } from '../components/YoutubeEmbed';
import { AlertTriangle, MessageCircle, ArrowLeft } from "lucide-react";
import styles from "./products.$productId.module.css";

export default function ProductDetailPage() {
  const { productId } = useParams<{productId: string;}>();
  const numericProductId = productId ? parseInt(productId, 10) : null;

  const {
    data: productData,
    isFetching: isProductFetching,
    error: productError
  } = useProduct(numericProductId);
  
  const {
    data: settingsData,
    isFetching: areSettingsFetching,
  } = useSettings();

  const product = productData?.product;
  const settings = settingsData?.settings;
  const whatsAppNumber = settings?.whatsappNumber;

  const isFetching = isProductFetching || areSettingsFetching;

  if (isFetching) {
    return <ProductDetailsSkeleton />;
  }

  if (productError || !product) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} className={styles.errorIcon} />
        <h1 className={styles.errorTitle}>Product Not Found</h1>
        <p className={styles.errorMessage}>
          {productError instanceof Error ?
          productError.message :
          "We couldn't find the shoe you're looking for."}
        </p>
        <Button asChild variant="outline">
          <Link to="/products">
            <ArrowLeft size={16} />
            Back to All Products
          </Link>
        </Button>
      </div>);
  }

  const galleryImages = [
    product.mainImageUrl,
    ...(product.galleryImagesUrls || [])
  ];

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(product.price));

  const formattedOfferPrice = product.offerPrice ? new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(product.offerPrice)) : null;

  const whatsAppMessage = `Hello, I'm interested in the ${product.name}.`;
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(
    whatsAppMessage
  )}`;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - CHAMP`}</title>
        <meta name="description" content={product.description || `Details about ${product.name}, a premium shoe available at CHAMP.`} />
      </Helmet>
      <div className={styles.pageContainer}>
        <div className={styles.backLinkContainer}>
          <Button asChild variant="link" className={styles.backLink}>
            <Link to="/products">
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </Button>
        </div>
        <div className={styles.productGrid}>
          <div className={styles.galleryContainer}>
            <ProductImageGallery images={galleryImages} alt={product.name} />
          </div>

          <div className={styles.detailsContainer}>
            <p className={styles.brand}>{product.brand}</p>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.meta}>
              <div className={styles.priceContainer}>
                {formattedOfferPrice ? (
                  <>
                    <p className={styles.offerPrice}>{formattedOfferPrice}</p>
                    <p className={styles.originalPrice}>{formattedPrice}</p>
                  </>
                ) : (
                  <p className={styles.price}>{formattedPrice}</p>
                )}
              </div>
              <Badge variant="secondary">{product.quality}</Badge>
            </div>

            {product.description &&
              <div className={styles.description}>
                <h2 className={styles.sectionTitle}>Description</h2>
                <p>{product.description}</p>
              </div>
            }

            {whatsAppNumber ?
              <Button asChild size="lg" className={styles.buyButton}>
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={20} />
                  Buy Now via WhatsApp
                </a>
              </Button> :
              <p className={styles.contactError}>
                Contact information is currently unavailable. Please check back later.
              </p>
            }
          </div>
        </div>

        {product.youtubeVideoUrl &&
          <div className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>Video Showcase</h2>
            <YoutubeEmbed url={product.youtubeVideoUrl} />
          </div>
        }
      </div>
    </>
  );
}