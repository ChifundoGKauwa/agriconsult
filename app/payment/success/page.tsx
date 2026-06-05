type PaymentSuccessPageProps = {
  searchParams: Promise<{
    tx_ref?: string;
    status?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold">Payment received</h1>
      <p className="mt-3 text-sm text-secondary">
        Thank you for your purchase. We are confirming the transaction with
        PayChangu.
      </p>
      {params.tx_ref ? (
        <p className="mt-4 rounded-xl bg-white p-4 text-sm">
          Transaction reference: <strong>{params.tx_ref}</strong>
        </p>
      ) : null}
    </div>
  );
}
