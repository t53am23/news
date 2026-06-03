import { Button } from "@/components/ui/button";

export function ContactForm() {
  return (
    <form className="premium-panel grid gap-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Name
          <input className="h-11 rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/25" placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input type="email" className="h-11 rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/25" placeholder="you@example.com" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Subject
        <input className="h-11 rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/25" placeholder="How can we help?" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Message
        <textarea className="min-h-36 rounded-xl border border-border bg-background p-3 outline-none focus:ring-2 focus:ring-primary/25" placeholder="Tell us what happened or what you need." />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Support email: support@signalbrief.com</p>
        <Button type="button" variant="premium">Send message</Button>
      </div>
    </form>
  );
}
