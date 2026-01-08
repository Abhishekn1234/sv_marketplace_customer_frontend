interface PaymentSummaryCardProps {
  amount: number;
  currency: string;
}

export const PaymentSummaryCard = ({ amount, currency }: PaymentSummaryCardProps) => {
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-white/90">
          <span>Service Amount</span>
          <span className="font-medium">
            {formatCurrency(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-white/90">
          <span>Tax & Fees</span>
          <span className="font-medium">
            {formatCurrency(0, currency)}
          </span>
        </div>
        <div className="border-t border-white/20 pt-3">
          <div className="flex justify-between items-center text-white">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-bold">
              {formatCurrency(amount, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};