import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage();
}
