import { sidebarSocials } from "@/lib/seo/site-config";
import {
  InstagramIcon,
  SoundcloudIcon,
  SpotifyIcon,
  YoutubeIcon,
} from "./social-icons";
import styles from "./site-sidebar.module.css";

const ICONS = {
  instagram: InstagramIcon,
  spotify: SpotifyIcon,
  soundcloud: SoundcloudIcon,
  youtube: YoutubeIcon,
} as const;

/**
 * Pinned for the whole scroll (position: fixed, see module CSS) rather than
 * living inside the scroll-transform tree Lenis/ScrollTrigger drive — it
 * must stay put regardless of section pinning/scrub happening around it.
 */
export function SiteSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Social links">
      <ul className={styles.list}>
        {sidebarSocials.map(({ key, label, href }) => {
          const Icon = ICONS[key];
          return (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={styles.link}
              >
                <Icon className={styles.icon} />
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
