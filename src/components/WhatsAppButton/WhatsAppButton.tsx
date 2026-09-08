import { WHATSAPP_URL } from "../../data/site";
import "./WhatsAppButton.css";

type Props = {
  label?: string;
  className?: string;
  floating?: boolean;
};

export function WhatsAppButton({
  label = "ליצירת קשר עם מיטל",
  className = "",
  floating = false,
}: Props) {
  return (
    <a
      href={WHATSAPP_URL}
      className={`whatsapp-btn ${floating ? "whatsapp-btn--floating" : ""} ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.04 2c-5.5 0-9.96 4.45-9.96 9.93 0 1.75.46 3.45 1.34 4.95L2 22l5.27-1.38a9.96 9.96 0 0 0 4.77 1.24h.01c5.49 0 9.95-4.46 9.95-9.95C22 6.45 17.54 2 12.04 2zm5.79 14.2c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.25-4.76-4.15-4.9-4.34-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.11.07.66-.17 1.34z"
        />
      </svg>
      {!floating && <span>{label}</span>}
    </a>
  );
}
