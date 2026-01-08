export default function SuspiciousItemsTable({ items }) {
  const displayItems =
    items && items.length > 0
      ? items
      : [
          {
            date: '2023-10-26',
            transactionId: 'TRN-00123',
            amount: '$150,000',
            anomalyScore: 'High',
            status: 'Review',
            reason: 'Unusual transaction amount.',
          },
          {
            date: '2023-09-15',
            transactionId: 'INV-00456',
            amount: '$5,000',
            anomalyScore: 'Medium',
            status: 'Flagged',
            reason: 'Inconsistent invoice number format.',
          },
          {
            date: '2023-08-01',
            transactionId: 'PAY-00789',
            amount: '$2,100',
            anomalyScore: 'Low',
            status: 'Cleared',
            reason: 'No specific suspicious items identified.',
          },
          {
            date: 'N/A',
            transactionId: 'N/A',
            amount: 'N/A',
            anomalyScore: 'Low',
            status: 'Normal',
            reason: 'No specific suspicious items identified.',
          },
        ];

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Review':
        return 'bg-red-500 text-white';
      case 'Flagged':
        return 'bg-yellow-400 text-gray-900';
      case 'Cleared':
      case 'Normal':
        return 'bg-green-500 text-gray-900';
      default:
        return '';
    }
  };

  const getAnomalyScoreClasses = (score) => {
    const scoreText = typeof score === 'string' ? score.toLowerCase() : '';
    if (scoreText.includes('high')) return 'text-red-400';
    if (scoreText.includes('medium')) return 'text-yellow-300';
    return 'text-green-400';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-100">
        Suspicious Transactions/Documents
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-700 rounded-tl-lg">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-700">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-700">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-700">
                Anomaly Score
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-200 bg-gray-700 rounded-tr-lg">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
              >
                <td className="px-4 py-3 text-sm text-gray-300">{item.date}</td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {item.transactionId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {item.amount}
                </td>
                <td
                  className={`px-4 py-3 text-sm ${getAnomalyScoreClasses(
                    item.anomalyScore
                  )}`}
                >
                  {item.anomalyScore}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClasses(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
