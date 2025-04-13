import BankAccountDetail from "../components/BankAccountDetail";

export default function BankAccountPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1 p-6">
        <BankAccountDetail />
      </main>
    </div>
  );
}
