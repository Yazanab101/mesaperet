import { useState, type FormEvent } from "react";
import { submitContactForm } from "../../services/contact";
import "./ContactForm.css";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("נא למלא שם פרטי ומשפחה");
      setStatus("error");
      return;
    }
    if (!phone.trim()) {
      setError("נא למלא טלפון");
      setStatus("error");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("נא למלא אימייל תקין");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await submitContactForm({ fullName, phone, email, message });
      setStatus("success");
      setFullName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("אירעה שגיאה בשליחה. נסו שוב או צרו קשר בוואטסאפ.");
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="contact-name">שם פרטי ומשפחה *</label>
        <input
          id="contact-name"
          type="text"
          name="fullName"
          placeholder="שם פרטי ומשפחה"
          aria-label="שם פרטי ומשפחה"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-phone">טלפון *</label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          placeholder="טלפון"
          aria-label="טלפון. מספר טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">אימייל *</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          placeholder="אימייל"
          aria-label="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">הודעה</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="הודעה"
          aria-label="הודעה"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" className="cta-pill" disabled={status === "submitting"}>
        {status === "submitting" ? "שולח..." : "שליחה"}
      </button>

      {status === "success" && (
        <p className="contact-form__success" role="status">
          ההודעה נשלחה בהצלחה. מיטל תחזור אליכם בהקדם.
        </p>
      )}
      {status === "error" && error && (
        <p className="contact-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
