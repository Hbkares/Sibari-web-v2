import type { Metadata } from "next";
import { Room } from "@/components/rooms/room";
import { RoomFooterNav } from "@/components/rooms/room-footer-nav";
import { getShows } from "@/lib/sanity/content";

export const metadata: Metadata = {
  title: "Contact — SIBARI",
  description: "Upcoming shows, past shows, and booking contact for SIBARI.",
};

const STATUS_LABEL: Record<string, string> = {
  announced: "Announced",
  on_sale: "Tickets on sale",
  sold_out: "Sold out",
};

export default async function ContactPage() {
  const { upcoming, past } = await getShows();

  return (
    <>
      <Room
        id="contact"
        eyebrow="Contact"
        title="Shows & booking"
        lead="For booking and press inquiries, reach out directly."
      >
        <section aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading">Upcoming shows</h2>
          {upcoming.length === 0 ? (
            <p>No shows announced yet.</p>
          ) : (
            <ul>
              {upcoming.map((show) => (
                <li key={show._id}>
                  <time dateTime={show.date}>
                    {new Date(show.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>{" "}
                  — {show.title ?? show.venue.name}, {show.venue.city}
                  {" · "}
                  {STATUS_LABEL[show.status] ?? show.status}
                  {show.ticketLink ? (
                    <>
                      {" · "}
                      <a href={show.ticketLink}>Tickets</a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {past.length > 0 ? (
          <section aria-labelledby="past-heading">
            <h2 id="past-heading">Past shows</h2>
            <ul>
              {past.map((show) => (
                <li key={show._id}>
                  <time dateTime={show.date}>
                    {new Date(show.date).getFullYear()}
                  </time>{" "}
                  — {show.title ?? show.venue.name}, {show.venue.city}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Room>
      <RoomFooterNav currentSlug="/contact" />
    </>
  );
}
