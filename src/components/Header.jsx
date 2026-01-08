'use client';

export default function Header({ data, onExplainClick }) {
  const financial_summary = data?.financial_summary || {
    totalRevenue: 0,
    netProfit: 0,
    currentRatio: 0,
  };

  const fraud_probability = data?.fraud_probability ?? 0;

  const formatCurrency = (value) =>
    `$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0)}`;

  const getCurrentRatioStatus = (ratio) => {
    if (ratio > 2) return 'Healthy';
    if (ratio >= 1) return 'Acceptable';
    return 'Unhealthy';
  };

  const getCurrentRatioClass = (ratio) => {
    if (ratio > 2) return 'text-green-500';
    if (ratio >= 1) return 'text-orange-400';
    return 'text-red-500';
  };

  const getFraudProbabilityStatus = (score) => {
    const probability = Number(score);
    if (probability > 60) return `${probability.toFixed(0)}% High`;
    if (probability > 30) return `${probability.toFixed(0)}% Medium`;
    return `${probability.toFixed(0)}% Low`;
  };

  const getFraudScoreClass = (score) => {
    const probability = Number(score);
    if (probability > 60) return 'text-red-500';
    if (probability > 30) return 'text-orange-400';
    return 'text-green-500';
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-b border-gray-700 mb-5">
      <h1 className="text-3xl font-bold text-gray-100 mb-4 md:mb-0">
        Financial Statement Analysis & Fraud Detection
      </h1>

      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {/* <div className="flex flex-col">
          <span className="text-gray-400">Total Revenue:</span>
          <span className="font-bold text-white">
            {formatCurrency(financial_summary?.totalRevenue)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Net Profit:</span>
          <span className="font-bold text-white">
            {formatCurrency(financial_summary?.netProfit)}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-400">Current Ratio:</span>
          <span
            className={`font-bold ${getCurrentRatioClass(
              financial_summary?.currentRatio
            )}`}
          >
            {(financial_summary?.currentRatio || 0).toFixed(2)}{' '}
            {getCurrentRatioStatus(financial_summary?.currentRatio)}
          </span>
        </div> */}

        <div className="flex flex-col">
          <span className="text-gray-400">Fraud Probability Score:</span>
          <span
            className={`font-bold ${getFraudScoreClass(fraud_probability)}`}
          >
            {getFraudProbabilityStatus(fraud_probability)}
          </span>
        </div>

        <div className="flex flex-row gap-3">
          <button
            onClick={() => (window.location.href = '/')}
            className=" px-4 py-2  cursor-pointer  font-semibold  bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  );
}
