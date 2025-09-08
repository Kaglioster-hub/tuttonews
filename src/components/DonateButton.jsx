"use client";

export default function DonateButton() {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_blank" className="flex justify-center">
      <input type="hidden" name="business" value="paypal@vrabo.it" />
      <input type="hidden" name="currency_code" value="EUR" />
      <input type="hidden" name="amount" value="18.00" />
      <button type="submit" className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-glow hover:scale-105 transition">
        Dona ora (18,00 €)
      </button>
    </form>
  );
}
