export const whatsappPhone = '+2349154908402';

export function createWhatsAppLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsappPhone}?text=${encoded}`;
}

export function productInquiryMessage(productName: string) {
  return `Hello Prolific Clothing, I'm interested in the ${productName}. I'd like to know more about availability, sizing and ordering.`;
}

export function styleInquiryMessage(styleId: string) {
  const styleUrl = `https://prolificclothings.com/styles/${styleId}`;
  return `Hello Prolific Clothing, I'm interested in Style ${styleId} from your Style Library. I'd like to know the price, fabric options and production details.\n\n${styleUrl}`;
}

export function savedStylesInquiryMessage(styleIds: string[]) {
  return `Hello Prolific Clothing, I've been browsing the Style Library and I'm interested in these styles:\n\n${styleIds.join('\n')}\n\nI'd like to discuss fabric options, pricing and production.\n\nhttps://prolificclothings.com/styles`;
}

export const generalInquiryMessage =
  "Hello Prolific Clothing, I'd like to enquire about your collections and bespoke services.";
