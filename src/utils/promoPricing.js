function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getTierDiscountPercent(price) {
  const safePrice = toNumber(price);

  if (safePrice > 500000) return 30;
  if (safePrice > 40000 && safePrice < 500000) return 25;
  return 10;
}

function applyPercent(price, percent) {
  const safePrice = toNumber(price);
  const safePercent = Math.max(0, Math.min(100, toNumber(percent)));
  return Math.round(safePrice * (1 - safePercent / 100));
}

export function applyPromoPricing(product, promoState) {
  if (!product) return null;

  const hasHiddenPrice = Boolean(product.hiddenPrice && !product.price);
  if (hasHiddenPrice) {
    return {
      ...product,
      basePrice: null,
      displayPrice: null,
      originalPrice: null,
      tierDiscountPercent: 0,
      promoDiscountPercent: 0,
      discountPercent: 0,
      isPromoApplied: false,
    };
  }

  const basePrice = toNumber(product.basePrice || product.price);
  const tierDiscountPercent = getTierDiscountPercent(basePrice);
  const promoDiscountPercent =
    promoState?.isActive && toNumber(promoState?.discountPercent) > 0
      ? toNumber(promoState.discountPercent)
      : 0;

  const originalFromTier = Math.round(
    basePrice / (1 - tierDiscountPercent / 100),
  );
  const effectivePercent = Math.max(tierDiscountPercent, promoDiscountPercent);
  const displayPrice =
    effectivePercent === tierDiscountPercent
      ? basePrice
      : applyPercent(originalFromTier, effectivePercent);

  return {
    ...product,
    basePrice,
    price: displayPrice,
    displayPrice,
    originalPrice: originalFromTier,
    tierDiscountPercent,
    promoDiscountPercent,
    discountPercent: effectivePercent,
    isPromoApplied: promoDiscountPercent > tierDiscountPercent,
  };
}

export function getCartPricing(cartItems = [], promoState) {
  const promoDiscountPercent =
    promoState?.isActive && toNumber(promoState?.discountPercent) > 0
      ? toNumber(promoState.discountPercent)
      : 0;

  return cartItems.reduce(
    (acc, item) => {
      const hasHiddenPrice = Boolean(
        item.hiddenPrice && !item.price && !item.basePrice,
      );
      if (hasHiddenPrice) {
        acc.hiddenItems += item.qty || 1;
        return acc;
      }

      const qty = Math.max(1, toNumber(item.qty || 1));
      const basePrice = toNumber(item.basePrice || item.price);
      const tierDiscountPercent = getTierDiscountPercent(basePrice);
      const effectivePercent = Math.max(
        tierDiscountPercent,
        promoDiscountPercent,
      );
      const originalFromTier = Math.round(
        basePrice / (1 - tierDiscountPercent / 100),
      );
      const finalPrice =
        effectivePercent === tierDiscountPercent
          ? basePrice
          : applyPercent(originalFromTier, effectivePercent);

      acc.subtotalBase += basePrice * qty;
      acc.total += finalPrice * qty;
      acc.savings += Math.max(0, basePrice - finalPrice) * qty;

      return acc;
    },
    {
      subtotalBase: 0,
      total: 0,
      savings: 0,
      hiddenItems: 0,
      promoDiscountPercent,
      isPromoActive: promoDiscountPercent > 0,
    },
  );
}
