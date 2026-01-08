export default function Footer() {
  const lastUpdated = new Date().toLocaleString();
  return (
    <footer className="text-center py-5 mt-8 border-t border-gray-700 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-5">
      <span>Last Updated: {lastUpdated}</span>
      <span>Powered by AI Financial Insights</span>
    </footer>
  );
}
