"use client";

import { useDeviceProfile } from "@/lib/device/device-tier-provider";
import { siteConfig } from "@/lib/seo/site-config";
import styles from "./landing-hero.module.css";

const VIDEO_POSTER = "/media/ci-vid-poster.jpg";

/**
 * Landing section (SIB-25): centered autoplay/loop loop-video, black
 * background, no controls, save/drag disabled. Under prefers-reduced-motion
 * we skip the <video> entirely and render the poster frame as a static
 * image instead of an autoplaying element the visitor didn't ask for.
 */
export function LandingHero() {
  const { prefersReducedMotion } = useDeviceProfile();

  return (
    <section id="landing" className={styles.hero} aria-label="Landing">
      <h1 className={styles.srOnly}>
        {siteConfig.name} — {siteConfig.tagline}
      </h1>
      {prefersReducedMotion ? (
        // Decorative, fixed local asset — next/image's runtime cost isn't worth it here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={VIDEO_POSTER} alt="" className={styles.media} draggable={false} />
      ) : (
        <video
          className={styles.media}
          poster={VIDEO_POSTER}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback"
          aria-hidden="true"
        >
          <source src="/media/ci-vid.webm" type="video/webm" />
          <source src="/media/ci-vid.mp4" type="video/mp4" />
        </video>
      )}
    </section>
  );
}
