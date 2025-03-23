import React, { useState } from 'react';
import { Search, Info, X } from 'lucide-react';
import rarityData from './data/ranked_nfts.json';
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const [nftId, setNftId] = useState('');
  const [nftData, setNftData] = useState(null);
  const [error, setError] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleSearch = () => {
    if (!nftId.trim()) {
      setError('Please enter an NFT ID');
      setNftData(null);
      return;
    }

    const foundNft = rarityData.find(nft => nft.id === nftId);
    
    if (foundNft) {
      setNftData(foundNft);
      setError('');
    } else {
      setError(`NFT #${nftId} not found`);
      setNftData(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate rarity tier based on rank
  const getRarityTier = (rank) => {
    if (rank <= 10) return { tier: 'Legendary', color: 'text-yellow-400' };
    if (rank <= 50) return { tier: 'Epic', color: 'text-purple-400' };
    if (rank <= 200) return { tier: 'Rare', color: 'text-blue-400' };
    if (rank <= 500) return { tier: 'Uncommon', color: 'text-cyan-400' };
    return { tier: 'Common', color: 'text-gray-400' };
  };

  // Get background color based on rarity score
  const getScoreBackground = (score) => {
    if (score > 100) return 'bg-green-900';
    if (score > 50) return 'bg-green-800';
    if (score > 20) return 'bg-green-700';
    if (score > 10) return 'bg-green-600';
    return 'bg-green-500';
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-green-400 p-6 flex flex-col items-center relative">
        <header className="mb-8 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center">Efrogs Rarity Checker</h1>
          <div className="flex justify-center mt-2">
            <a 
              href="https://element.market/collections/ethereum-frogs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-100 text-md flex items-center"
            >
              View collection on Element Market
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </header>

        <div className="w-full max-w-md">
          <div className="relative mb-8">
            <input
              type="text"
              value={nftId}
              onChange={(e) => setNftId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter NFT ID (e.g. 696)"
              className="w-full px-4 py-3 bg-gray-800 border border-green-500 rounded-lg text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-2 top-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <Search size={24} className="text-green-400" />
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-center mb-4">
              {error}
            </div>
          )}

          {nftData && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-green-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Efrog #{nftData.id}</h2>
                <div>
                  <span className="text-xs uppercase tracking-wide mr-2">Rank</span>
                  <span className="text-2xl font-bold">#{nftData.rank}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span>Rarity Tier:</span>
                  <span className={getRarityTier(nftData.rank).color + " font-bold"}>
                    {getRarityTier(nftData.rank).tier}
                  </span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span>Total Rarity Score:</span>
                  <span className="font-bold">{nftData.total_score.toFixed(2)}</span>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3 border-b border-green-700 pb-1">Trait Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(nftData.trait_scores).map(([trait, data]) => (
                  <div key={trait} className="rounded-md bg-gray-700 p-3">
                    <div className="flex justify-between text-sm text-green-300 mb-1">
                      <span>{trait}</span>
                      <span>{data.value}</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-200 mb-2">
                      <span>Occurrence: {data.count} ({data.rarity_percentage.toFixed(2)}%)</span>
                      <span>Score: {data.rarity_score.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`${getScoreBackground(data.rarity_score)} h-2 rounded-full`}
                        style={{ width: `${Math.min(data.rarity_score, 150) / 150 * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info button (bottom right) */}
        <button 
          onClick={() => setShowInfoModal(true)}
          className="fixed bottom-6 right-6 bg-green-600 rounded-full p-3 shadow-lg hover:bg-green-700 transition-colors"
          aria-label="Show information"
        >
          <Info size={24} className="text-gray-900" />
        </button>

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-screen overflow-y-auto border border-green-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-400">Rarity Information</h2>
                <button 
                  onClick={() => setShowInfoModal(false)}
                  className="text-green-400 hover:text-green-300"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6 text-green-200">
                <div>
                  <h3 className="text-xl font-medium text-green-400 mb-2">Rarity Tiers</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-24 text-yellow-400 font-bold">Legendary</span>
                      <span>Top 10 Efrogs (Ranks 1-10)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24 text-purple-400 font-bold">Epic</span>
                      <span>Top 50 Efrogs (Ranks 11-50)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24 text-blue-400 font-bold">Rare</span>
                      <span>Top 200 Efrogs (Ranks 51-200)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24 text-cyan-400 font-bold">Uncommon</span>
                      <span>Top 500 Efrogs (Ranks 201-500)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-24 text-gray-400 font-bold">Common</span>
                      <span>All other Efrogs (Ranks 501+)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-green-400 mb-2">How Rarity Is Calculated</h3>
                  <p className="mb-2">
                    Rarity is calculated using a statistical model that considers the rarity of each trait an Efrog possesses.
                  </p>
                  <p className="mb-2">
                    <strong>Rarity Score</strong> for a trait = 1 / (trait occurrence percentage)
                  </p>
                  <p>
                    The rarer a trait is within the collection, the higher its rarity score. The total rarity score is the sum of all individual trait scores.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-green-400 mb-2">Trait Score Visualization</h3>
                  <p>
                    The green bar under each trait represents its rarity score visually. Longer bars indicate rarer traits with higher scores:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-center">
                      <div className="w-16 h-3 bg-green-900 mr-3 rounded-full"></div>
                      <span>100+ points (Extremely rare)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-12 h-3 bg-green-800 mr-3 rounded-full"></div>
                      <span>50-100 points (Very rare)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-8 h-3 bg-green-700 mr-3 rounded-full"></div>
                      <span>20-50 points (Rare)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-3 bg-green-600 mr-3 rounded-full"></div>
                      <span>10-20 points (Uncommon)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-4 h-3 bg-green-500 mr-3 rounded-full"></div>
                      <span>0-10 points (Common)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-green-400 mb-2">Collection Information</h3>
                  <p>
                    Efrogs is a limited NFT collection. Each Efrog has a unique combination of traits that determines its overall rarity within the ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Analytics />
    </>
  );
};

export default App;