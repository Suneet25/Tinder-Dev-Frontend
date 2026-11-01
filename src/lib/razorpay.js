const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loading;

// Injects Razorpay's checkout script once and reuses it afterwards.
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = resolve;
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("Couldn't load Razorpay."));
    };
    document.body.appendChild(script);
  });
  return loading;
}

// `order` is the POST /payment/create response: { orderId, amount, currency, keyId, ... }.
// Razorpay keeps its modal open after a failed attempt so the user can retry;
// onDismiss fires when they close it without paying.
export function openRazorpay({ order, description, prefill, color, onSuccess, onFailure, onDismiss }) {
  const checkout = new window.Razorpay({
    key: order.keyId,
    order_id: order.orderId,
    amount: order.amount,
    currency: order.currency,
    name: "Tinder-Dev",
    description,
    prefill,
    theme: { color },
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  });
  checkout.on("payment.failed", (response) => onFailure(response.error?.description ?? "Payment failed. Please try again."));
  checkout.open();
}
