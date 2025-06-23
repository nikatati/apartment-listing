import React from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import "./ApartmentListingPage.css";

const Button = ({ children, className = "", ...props }) => (
  <button className={`btn ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children }) => <div className="card">{children}</div>;

const Section = ({ title, description, videoSrc, reverse = false }) => (
  <motion.div
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
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function ApartmentListingPage() {
  const sections = [
    {
      title: "סלון, מטבח ומרפסת שמש ראשונה",
      description:
        "חלל מרכזי מרווח ומואר עם יציאה למרפסת שמש מפנקת. המטבח מאובזר קומפלט ופתוח לסלון, אידיאלי לאירוח.",
      videoSrc: "/videos/living-room.mp4",
    },
    {
      title: "יחידת הורים",
      description:
        "סוויטת הורים גדולה ומפנקת עם חדר רחצה צמוד. החדר מציע פרטיות מלאה ושקט, עם חלונות גדולים לנוף פתוח.",
      videoSrc: "/apartment-listing/videos/master-bedroom.mp4",
      reverse: true,
    },
    {
      title: "חדרי שינה ומרפסת שמש שנייה",
      description:
        "פרוזדור המוביל לחדרי שינה נוספים, מרווחים ונעימים, עם גישה למרפסת שמש שנייה ואינטימית.",
      videoSrc: "/videos/hallway-balcony2.mp4",
    },
    {
      title: "חדר רחצה מרכזי ושירותי אורחים",
      description:
        "חדר רחצה גדול ומעוצב הכולל מקלחון מודרני. בנוסף, שירותי אורחים נפרדים ומעוצבים לנוחות מקסימלית.",
      videoSrc: "/videos/bathroom.mp4",
      reverse: true,
    },
    {
      title: "מרפסת שמש ראשונה",
      description:
        "מרפסת פתוחה ומוארת הצמודה לסלון המרכזי. מושלמת לבילוי נעים בשעות הבוקר והערב, עם נוף פתוח ואוויר צח.",
      videoSrc: "/videos/balcony1.mp4",
      reverse: false,
    },
    {
      title: "חדר שירות",
      description:
        "חדר שירות נוח ומרווח הכולל הכנה למכונת כביסה ושטח אחסון. ממוקם בנפרד ומאפשר סדר ויעילות בבית.",
      videoSrc: "/videos/utility-room.mp4",
      reverse: true,
    },
  ];

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
        </motion.div>

        {sections.map((section, index) => (
          <Section key={index} {...section} />
        ))}
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
