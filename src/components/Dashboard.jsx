'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '../components/Header';
import AIInsightsModal from '../components/AIInsightsModal';
import FinancialTrends from '../components/FinancialTrends';
import BalanceSheetOverview from '../components/BalanceSheetOverview';
import FraudProbabilityScore from '../components/FraudProbabilityScore';
import AnomalyDetectionInsights from '../components/AnomalyDetectionInsights';
import Layout from '../components/Layout';

export default function Dashboard() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('analysisResults');
    if (!stored) {
      router.push('/');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      console.log('LOADED ANALYSIS:', parsed);
      setAnalysis(parsed);
    } catch (e) {
      console.error('Invalid stored analysis', e);
      router.push('/');
    }
  }, []);

  if (!analysis) return null;

  return (
    <Layout>
      <Header data={analysis} onExplainClick={() => setShowAI(true)} />

      <AIInsightsModal
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        analysis={analysis}
      />

      <div className="px-5 py-3 text-white flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FIXED - Pass only correct trending data */}
          <FinancialTrends
            data={{
              numericTrends: analysis.numericTrends || [],
              trendType: analysis.trendType || 'numeric',
            }}
          />

          <div className="flex flex-col gap-6">
            <FraudProbabilityScore analysis={analysis} />

            <BalanceSheetOverview
              data={{
                totalAssets: analysis.engineeredFeatures?.sum || 0,
                totalLiabilities: analysis.engineeredFeatures?.max || 0,
                totalEquity:
                  (analysis.engineeredFeatures?.sum || 0) -
                  (analysis.engineeredFeatures?.max || 0),
              }}
            />
          </div>
        </div>

        <AnomalyDetectionInsights analysis={analysis} />
      </div>
    </Layout>
  );
}
