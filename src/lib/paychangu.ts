"use client";

type PayChanguCustomer = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type PayChanguProduct = {
  id?: string;
  title: string;
  description?: string;
  price: string;
};

type PayChanguCheckoutOptions = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: "MWK";
  callback_url: string;
  return_url: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
  };
  customization: {
    title: string;
    description: string;
  };
  meta: Record<string, string>;
};

declare global {
  interface Window {
    PaychanguCheckout?: (options: PayChanguCheckoutOptions) => void;
    jQuery?: unknown;
    $?: unknown;
  }
}

const PAYCHANGU_POPUP_SCRIPT = "https://in.paychangu.com/js/popup.js";
const JQUERY_SCRIPT = "https://code.jquery.com/jquery-3.7.1.min.js";

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load script: ${src}`));
    document.body.appendChild(script);
  });

export const preloadPayChangu = async () => {
  if (typeof window === "undefined") return;

  if (!window.jQuery && !window.$) {
    await loadScript(JQUERY_SCRIPT);
  }

  if (!window.PaychanguCheckout) {
    await loadScript(PAYCHANGU_POPUP_SCRIPT);
  }
};

export const getMwkAmount = (price: string) => {
  const amount = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? Math.round(amount) : 0;
};

const getPublicAppUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (window.location.hostname === "localhost") {
    return window.location.origin;
  }

  return window.location.origin;
};

export const openPayChanguCheckout = (
  product: PayChanguProduct,
  customer: PayChanguCustomer = {}
) => {
  if (typeof window === "undefined") return;

  const amount = getMwkAmount(product.price);
  if (amount <= 0) {
    window.alert("This product does not have a valid MWK price yet.");
    return;
  }

  if (!window.PaychanguCheckout) {
    window.alert("Payment is still loading. Please try again in a moment.");
    preloadPayChangu().catch((error) => console.error(error));
    return;
  }

  const txRef = `agriconsult-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const appUrl = getPublicAppUrl();

  window.PaychanguCheckout({
    public_key: PAYCHANGU_PUBLIC_KEY,
    tx_ref: txRef,
    amount,
    currency: "MWK",
    callback_url: `${appUrl}/payment/success?tx_ref=${encodeURIComponent(txRef)}`,
    return_url: `${appUrl}/payment/success?tx_ref=${encodeURIComponent(txRef)}`,
    customer: {
      email: customer.email || "customer@example.com",
      first_name: customer.firstName || "AgriConsult",
      last_name: customer.lastName || "Customer",
    },
    customization: {
      title: product.title,
      description: product.description || "AgriConsult product payment",
    },
    meta: {
      product_id: product.id || "",
      product_title: product.title,
    },
  });
};

export const PAYCHANGU_PUBLIC_KEY = "pub-test-ONJWYC7chixhARkrg610kU8NUSDiLT4B";
