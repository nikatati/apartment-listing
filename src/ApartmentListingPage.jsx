import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  PlayCircle,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import "./ApartmentListingPage.css";

const Button = ({ children, className = "", ...props }) => (
  <button className={`btn ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children }) => <div className="card">{children}</div>;

const Section = ({
  id,
  title,
  description,
  videoSrc,
  reverse = false,
  pairedLink,
}) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7 }}
    className="section"
  >
    <Card>
      <div className={`section-inner ${reverse ? "reverse" : ""}`}>
        <div className="video-container">
          {videoSrc ? (
            <video controls preload="metadata">
              <source src={videoSrc} type="video/mp4" />
              הדפדפן שלך לא תומך בווידאו.
            </video>
          ) : (
            <div className="no-video">
              <PlayCircle size={64} />
              <p>תצוגה חזותית בקרוב</p>
            </div>
          )}
        </div>
        <div className="section-text">
          <h3>{title}</h3>
          <p>{description}</p>
          {pairedLink && (
            <a
              className="paired-link"
              href={pairedLink.href}
              onClick={pairedLink.onClick}
            >
              {pairedLink.label}
            </a>
          )}
        </div>
      </div>
    </Card>
  </motion.div>
);

const StateHeading = ({ id, title, subtitle }) => (
  <div id={id} className="state-heading">
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </div>
);

const PhotoGallery = ({ photos, highlightedRoom, onClearHighlight }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const isOpen = openIndex !== null;
  const closeButtonRef = useRef(null);
  const lastTriggerRef = useRef(null);

  const showNext = () => setOpenIndex((i) => (i + 1) % photos.length);
  const showPrev = () =>
    setOpenIndex((i) => (i - 1 + photos.length) % photos.length);

  const openPhoto = (index, trigger) => {
    lastTriggerRef.current = trigger;
    setOpenIndex(index);
  };

  const close = () => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      // RTL: left arrow moves forward
      if (e.key === "ArrowLeft") showNext();
      if (e.key === "ArrowRight") showPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (photos.length === 0) {
    return (
      <Card>
        <div className="no-photos">
          <ImageIcon size={64} />
          <p>תמונות בקרוב</p>
        </div>
      </Card>
    );
  }

  const highlightedCount = photos.filter(
    (p) => p.room === highlightedRoom
  ).length;
  const highlightedTitle = sections.find((s) => s.id === highlightedRoom)
    ?.title;

  return (
    <>
      <div className="highlight-status" aria-live="polite">
        {highlightedCount > 0 && (
          <>
            <span>
              {highlightedCount === 1
                ? `מודגשת התמונה של "${highlightedTitle}"`
                : `מודגשות ${highlightedCount} התמונות של "${highlightedTitle}"`}
            </span>
            <button
              type="button"
              className="highlight-clear"
              onClick={onClearHighlight}
            >
              הצגת כל התמונות
            </button>
          </>
        )}
      </div>
      <ul className="gallery" aria-label="תמונות הדירה המאוכלסת">
        {photos.map((photo, index) => (
          <motion.li
            key={photo.src}
            id={
              // only the first photo of each room is the anchor target
              photos.findIndex((p) => p.room === photo.room) === index
                ? `furnished-${photo.room}`
                : undefined
            }
            className="gallery-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <figure
              className={
                highlightedCount === 0
                  ? undefined
                  : photo.room === highlightedRoom
                  ? "is-highlighted"
                  : "is-dimmed"
              }
            >
              {photo.room === highlightedRoom && (
                <span className="selected-badge">החדר שבחרת</span>
              )}
              <button
                type="button"
                className="gallery-item"
                aria-label={`הגדלת התמונה: ${photo.title}`}
                onClick={(e) => openPhoto(index, e.currentTarget)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </button>
              <figcaption>
                <span className="gallery-badge">מאוכלס</span>
                <strong>{photo.title}</strong>
                <a
                  className="paired-link"
                  href={`#${photo.room}`}
                  aria-label={`${photo.title}: מעבר לסרטון של החלל כשהוא ריק`}
                >
                  לצפייה בחדר כשהוא ריק
                </a>
              </figcaption>
            </figure>
          </motion.li>
        ))}
      </ul>

      {isOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${photos[openIndex].title}, תמונה ${openIndex + 1} מתוך ${photos.length}`}
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="lightbox-close"
            aria-label="סגירה"
            onClick={close}
          >
            <X size={32} />
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            aria-label="תמונה קודמת"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
          >
            <ChevronRight size={40} />
          </button>
          <img
            src={photos[openIndex].src}
            alt={photos[openIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            aria-label="תמונה הבאה"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
          >
            <ChevronLeft size={40} />
          </button>
          <span className="lightbox-counter" aria-hidden="true">
            {photos[openIndex].title} · {openIndex + 1} / {photos.length}
          </span>
        </div>
      )}
    </>
  );
};

// Furnished apartment media - files go in public/videos and public/images/furnished
const furnishedVideo = "/apartment-listing/videos/furnished-apartment.mp4";
// `room` must match the id of the empty-apartment section it pairs with
const furnishedPhotos = [
  {
    room: "living-room",
    title: "סלון",
    src: "/apartment-listing/images/furnished/living-room.jpeg",
    alt: "הסלון מרוהט: ספה פינתית בצבע בורדו, כורסה, שולחן קפה מזכוכית, טלוויזיה על הקיר ונברשת קריסטל. בקצה החדר דלת הזזה מזכוכית שיוצאת למרפסת השמש עם עצים ירוקים מאחור.",
  },
  {
    room: "living-room",
    title: "מטבח",
    src: "/apartment-listing/images/furnished/kitchen.jpeg",
    alt: "המטבח ופינת האוכל: ארונות עץ בגוון טבעי, כיריים גז, כיור מתחת לחלון, מקרר גדול מנירוסטה ושולחן אוכל אובלי מעץ עם שישה כיסאות ומראה גדולה על הקיר.",
  },
  {
    room: "living-room",
    title: "מרפסת שמש ראשונה",
    src: "/apartment-listing/images/furnished/balcony1.jpeg",
    alt: "מרפסת השמש הראשונה: מרפסת מרווחת עם סוכך, גדר קנים ועציצים עם פרחים, ונוף פתוח לעצים ירוקים ולשמיים כחולים.",
  },
  {
    room: "master-bedroom",
    title: "יחידת הורים",
    src: "/apartment-listing/images/furnished/master-bedroom.jpeg",
    alt: "יחידת ההורים מרוהטת: מיטה זוגית עם מצעים בהדפס פרחים ועלים, שידת לילה, שטיח קטן וארון בגדים לבן. החדר מואר בחלון גדול, ויש בו דלת זכוכית עם סורג דקורטיבי שיוצאת החוצה.",
  },
  {
    room: "hallway-balcony2",
    title: "חדר שינה 1",
    src: "/apartment-listing/images/furnished/bedroom1.jpeg",
    alt: "חדר שינה ראשון מרוהט: מיטה זוגית עם ראש מיטה מרופד אפור וכיסוי בגווני בורדו וזהב, שידה עם טלוויזיה על הקיר, וחלון עם תריס שמשקיף לעצים ירוקים.",
  },
  {
    room: "hallway-balcony2",
    title: "חדר שינה 2",
    src: "/apartment-listing/images/furnished/bedroom2.jpeg",
    alt: "חדר שינה שני מרוהט כחדר שינה ועבודה: מיטה עם מצעים לבנים מודפסים, שידה קטנה, שולחן כתיבה לבן עם כיסא משרדי ומנורת שולחן, וחלון שמכניס אור טבעי.",
  },
  {
    room: "bathroom",
    title: "חדר רחצה מרכזי ושירותי אורחים",
    src: "/apartment-listing/images/furnished/bathroom.jpeg",
    alt: "חדר הרחצה המרכזי בשימוש יומיומי: קירות וריצוף אפורים בהירים, ארון כיור מעץ עם מראה, אסלה תלויה, חלון ומקלחון זכוכית עם ראש מקלחת גשם.",
  },
];

const sections = [
  {
    id: "living-room",
    title: "סלון, מטבח ומרפסת שמש ראשונה",
    description:
      "חלל מרכזי מרווח ומואר עם יציאה למרפסת שמש מפנקת. המטבח מאובזר קומפלט ופתוח לסלון, אידיאלי לאירוח.",
    videoSrc: "/apartment-listing/videos/living-room.mp4",
  },
  {
    id: "master-bedroom",
    title: "יחידת הורים",
    description:
      "סוויטת הורים גדולה ומפנקת עם חדר רחצה צמוד. החדר מציע פרטיות מלאה ושקט, עם חלונות גדולים לנוף פתוח.",
    videoSrc: "/apartment-listing/videos/master-bedroom.mp4",
    reverse: true,
  },
  {
    id: "hallway-balcony2",
    title: "חדרי שינה ומרפסת שמש שנייה",
    description:
      "פרוזדור המוביל לחדרי שינה נוספים, מרווחים ונעימים, עם גישה למרפסת שמש שנייה ואינטימית.",
    videoSrc: "/apartment-listing/videos/hallway-balcony2.mp4",
  },
  {
    id: "bathroom",
    title: "חדר רחצה מרכזי ושירותי אורחים",
    description:
      "חדר רחצה גדול ומעוצב הכולל מקלחון מודרני. בנוסף, שירותי אורחים נפרדים ומעוצבים לנוחות מקסימלית.",
    videoSrc: "/apartment-listing/videos/bathroom.mp4",
    reverse: true,
  },
  {
    id: "balcony1",
    title: "מרפסת שמש ראשונה",
    description:
      "מרפסת פתוחה ומוארת הצמודה לסלון המרכזי. מושלמת לבילוי נעים בשעות הבוקר והערב, עם נוף פתוח ואוויר צח.",
    videoSrc: "/apartment-listing/videos/balcony1.mp4",
    reverse: false,
  },
  {
    id: "utility-room",
    title: "חדר שירות",
    description:
      "חדר שירות נוח ומרווח הכולל הכנה למכונת כביסה ושטח אחסון. ממוקם בנפרד ומאפשר סדר ויעילות בבית.",
    videoSrc: "/apartment-listing/videos/utility-room.mp4",
    reverse: true,
  },
];

export default function ApartmentListingPage() {
  const [highlightedRoom, setHighlightedRoom] = useState(null);

  return (
    <div dir="rtl" className="page">
      <header className="hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1>דירת החלומות שלכם מחכה לכם</h1>
          <p>דירת 4 חדרים מרווחת, משופצת ומעוצבת.</p>
        </motion.div>
      </header>

      <section className="details">
        <div className="detail-item">
          <MapPin size={32} className="icon" />
          <strong>באר שבע, נווה מנחם (נחל עשן)</strong>
          <span>מיקום מנצח ושקט</span>
        </div>
        <div className="detail-item">
          <BedDouble size={32} className="icon" />
          <strong>4 חדרים</strong>
          <span>כולל יחידת הורים</span>
        </div>
        <div className="detail-item">
          <Bath size={32} className="icon" />
          <strong>חדר רחצה</strong>
          <span>משופץ ומאובזר</span>
        </div>
        <div className="detail-item">
          <Ruler size={32} className="icon" />
          <strong>100 מ"ר</strong>
          <span>מרווחת ומוארת</span>
        </div>
      </section>

      <main className="main">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="intro"
        >
          <h2>כל מה שצריך לחיים הטובים</h2>
          <p>
            דירה מדהימה שעברה שיפוץ מקיף מהיסוד. ממוקמת בלב העיר, קרובה למרכזי
            קניות ותחבורה ציבורית. עם 2 מרפסות שמש ונוף פתוח, היא מציעה איכות
            חיים ללא פשרות.
          </p>
          <nav className="state-switch">
            <a href="#empty">הדירה ריקה</a>
            <a href="#furnished" onClick={() => setHighlightedRoom(null)}>
              הדירה מאוכלסת
            </a>
          </nav>
        </motion.div>

        <StateHeading
          id="empty"
          title="הדירה ריקה"
          subtitle="סיור בכל חדרי הדירה כשהיא ריקה ומוכנה לכניסה"
        />
        {sections.map((section) => (
          <Section
            key={section.id}
            {...section}
            pairedLink={
              furnishedPhotos.some((p) => p.room === section.id)
                ? {
                    href: `#furnished-${section.id}`,
                    label: "לצפייה בחדר כשהוא מאוכלס",
                    onClick: () => setHighlightedRoom(section.id),
                  }
                : undefined
            }
          />
        ))}

        <StateHeading
          id="furnished"
          title="הדירה מאוכלסת"
          subtitle="כך הדירה נראית כשגרים בה"
        />
        <Section
          title="סיור בדירה המאוכלסת"
          description="סרטון של הדירה מרוהטת ומעוצבת, שממחיש את הפוטנציאל של כל חלל."
          videoSrc={furnishedVideo}
        />
        <PhotoGallery
          photos={furnishedPhotos}
          highlightedRoom={highlightedRoom}
          onClearHighlight={() => setHighlightedRoom(null)}
        />
      </main>

      <footer className="contact">
        <h2>מעוניינים בפרטים נוספים?</h2>
        <p>אל תהססו להתקשר ולתאם ביקור בדירה. אני זמין לכל שאלה.</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="call-links">
            <a href="tel:0535309655" className="call-button">
              <div className="call-item">
                <Phone size={20} />
                <span>053-530-9655 ניקה</span>
              </div>
            </a>
            <a href="tel:0547334682" className="call-button">
              <div className="call-item">
                <Phone size={20} />
                <span>054-733-4682 איציק</span>
              </div>
            </a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
