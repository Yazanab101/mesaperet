export type ContactPayload = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};

/**
 * Dedicated submit integration point.
 * Replace the body of this function with your backend / form endpoint.
 */
export async function submitContactForm(payload: ContactPayload): Promise<void> {
  // Frontend-ready stub: logs locally and simulates network latency.
  // Wire this to email API, Formspree, Supabase, etc. without changing UI code.
  await new Promise((r) => setTimeout(r, 600));

  if (!payload.fullName.trim() || !payload.phone.trim() || !payload.email.trim()) {
    throw new Error("missing-required");
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
  if (!emailOk) throw new Error("invalid-email");

  // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) })
  console.info("[contact-form]", payload);
}
