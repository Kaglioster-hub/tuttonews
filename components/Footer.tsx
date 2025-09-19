export default function Footer() {
  return (
    <footer className="mt-20 py-10 border-t border-white/10 text-center text-sm opacity-80">
      <p>© 2025 TuttoNews24 – Aggregatore indipendente</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <a href="https://paypal.me/vrabo" target="_blank" rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-400">
          Donazione PayPal
        </a>
        <a href="https://buy.stripe.com/test_xxx" target="_blank" rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-400">
          Donazione Stripe
        </a>
        <a href="https://etherscan.io/address/0xe77E6C411F2ee01F1cfbccCb1c418c80F1a534fe"
          target="_blank" rel="noopener noreferrer"
          className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400">
          Donazione Crypto
        </a>
      </div>
      <p className="mt-4 opacity-60">Questo sito utilizza feed pubblici. Nessun contenuto è ospitato localmente.</p>
    </footer>
  );
}
