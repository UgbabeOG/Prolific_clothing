export const whatsappPhone = '2348000000000';

export function createWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappPhone}?text=${encoded}`;
}

export function productInquiryMessage(productName: string) {
  return `Hello Prolific Clothing, I'm interested in the ${productName}. I'd like to know more about availability, sizing and ordering.`;
}

export const generalInquiryMessage =
  "Hello Prolific Clothing, I'd like to enquire about your collections and bespoke services.";
