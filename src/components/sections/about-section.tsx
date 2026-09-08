import Image from "next/image";
import { siteConfig } from "@/lib/seo/site-config";
import styles from "./about-section.module.css";

export function AboutSection() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.grid}>
        <div>
          <p className={styles.eyebrow}>About</p>
          <h2 id="about-heading" className={styles.headline}>
            Fourteen years of progressive house.
          </h2>
          <p className={styles.body}>{siteConfig.bio}</p>
        </div>
        <div className={styles.imageWrap}>
          <Image
            src="/images/bio-sibari.jpg"
            alt="Portrait of Sibari"
            width={1000}
            height={1237}
            className={styles.image}
            sizes="(min-width: 768px) 22rem, 80vw"
          />
        </div>
      </div>
    </section>
  );
}
