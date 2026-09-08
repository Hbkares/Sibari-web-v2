import { siteConfig } from "@/lib/seo/site-config";
import styles from "./contact-section.module.css";

const SECONDARY_LINKS = [
  { label: "Spotify", href: siteConfig.socials.spotify },
  { label: "SoundCloud", href: siteConfig.socials.soundcloud },
  { label: "YouTube", href: siteConfig.socials.youtube },
];

export function ContactSection() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div>
        <p className={styles.eyebrow}>Contact</p>
        <h2 id="contact-heading" className={styles.headline}>
          Bookings &amp; press.
        </h2>
        <p className={styles.body}>
          For bookings, press, and collaborations, reach out directly.
        </p>
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryCta}
        >
          DM @hbkares on Instagram
        </a>
        <ul className={styles.secondaryList}>
          {SECONDARY_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryLink}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.footer}>
        <span className={styles.mark}>{siteConfig.name}</span>
        <span className={styles.copyright}>
          &copy; {year} {siteConfig.artistName}
        </span>
      </div>
    </footer>
  );
}
