import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { CATEGORIES } from "../data/domains";

const ALL_DOMAINS = CATEGORIES.flatMap((c) => c.domains.map((d) => d.name));
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full bg-white/[0.03] border border-white/15 focus:border-[#CCFF00]/60 outline-none px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors font-light";

export const LeadFormModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", offer: "", message: "" });
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);

  const toggleDomain = (name) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/leads`, { ...form, domains: selected });
      toast.success("Offer received", {
        description: "Thanks — we'll get back to you within 24 hours.",
      });
      setForm({ name: "", email: "", offer: "", message: "" });
      setSelected([]);
      onClose();
    } catch {
      toast.error("Something went wrong", { description: "Please try again in a moment." });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
          onClick={onClose}
          data-testid="lead-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/10 p-7 md:p-10"
            onClick={(e) => e.stopPropagation()}
            data-testid="lead-modal"
          >
            <span className="absolute top-0 left-0 w-full h-px bg-[#CCFF00]" />
            <button
              onClick={onClose}
              data-testid="lead-modal-close"
              aria-label="Close offer form"
              className="absolute top-5 right-5 p-2 text-white/40 hover:text-[#CCFF00] transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <p className="font-mono2 text-xs tracking-[0.3em] uppercase text-[#CCFF00]">Direct Line</p>
            <h3 className="font-display font-bold uppercase tracking-tight text-2xl md:text-3xl mt-3" data-testid="lead-modal-title">
              Make a Bulk Offer
            </h3>
            <p className="mt-3 text-sm text-white/50 font-light leading-relaxed">
              Interested in several TLDs or the whole portfolio? Skip the cart — tell us what you want and what you'll pay.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5" data-testid="lead-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  required
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  data-testid="lead-name-input"
                  className={inputCls}
                />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="Email address"
                  data-testid="lead-email-input"
                  className={inputCls}
                />
              </div>
              <input
                value={form.offer}
                onChange={set("offer")}
                placeholder="Your offer (USD) — e.g. 25,000"
                data-testid="lead-offer-input"
                className={inputCls}
              />

              <div>
                <p className="font-mono2 text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">
                  Domains of interest
                </p>
                <div className="flex flex-wrap gap-2" data-testid="lead-domain-chips">
                  {ALL_DOMAINS.map((name) => {
                    const active = selected.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleDomain(name)}
                        data-testid={`lead-chip-${name.replace(".", "")}`}
                        className={`font-mono2 text-[11px] px-3 py-1.5 border transition-colors duration-200 ${
                          active
                            ? "bg-[#CCFF00] text-[#050505] border-[#CCFF00]"
                            : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder="Anything else we should know? (optional)"
                rows={3}
                data-testid="lead-message-input"
                className={`${inputCls} resize-none`}
              />

              <button
                type="submit"
                disabled={sending}
                data-testid="lead-submit-button"
                className="btn-acid w-full inline-flex items-center justify-center gap-3 bg-[#CCFF00] text-[#050505] font-mono2 text-sm tracking-[0.15em] uppercase px-8 py-4 disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Send className="w-4 h-4" strokeWidth={2} />
                )}
                {sending ? "Sending..." : "Send Offer"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
