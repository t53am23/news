import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact and Support",
  description: "Contact the Choyis news support team."
};

export default function ContactSupportPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Contact/Support</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Send a support message, source suggestion, correction request, or partnership note. This form is UI-only until the Supabase Edge Function is connected.
        </p>
      </header>
      <ContactForm />
    </div>
  );
}
