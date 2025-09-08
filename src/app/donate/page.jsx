import DonateButton from "@/components/DonateButton";

export default function DonatePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-6">Sostieni TuttoNews24</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Il nostro servizio resta gratuito e accessibile a tutti. Puoi contribuire con una donazione volontaria:
        l’importo consigliato è <strong>18,00 €</strong>. Grazie al tuo supporto possiamo migliorare sempre di più!
      </p>
      <DonateButton />
    </main>
  );
}
