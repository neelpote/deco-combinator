import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStartupStatus, getAllStartups } from '../stellar';
import { useIPFSMetadata } from '../hooks/useIPFSMetadata';

// Public startup card component (no voting, just viewing)
const PublicStartupCard = ({ 
  address, 
  onClick 
}: { 
  address: string; 
  onClick: () => void; 
}) => {
  const { data: startupData } = useQuery({
    queryKey: ['startupCard', address],
    queryFn: () => getStartupStatus(address),
    staleTime: 10000,
  });

  const { data: metadata } = useIPFSMetadata(startupData?.ipfs_cid);

  if (!startupData) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const totalVotes = Number(startupData.yes_votes) + Number(startupData.no_votes);
  const approvalRate = totalVotes > 0 ? Math.round((Number(startupData.yes_votes) / totalVotes) * 100) : 0;
  
  const getTimeRemaining = (endTime: number | bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const endTimeNum = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    const remaining = endTimeNum - now;
    
    if (remaining <= 0) return 'Voting ended';
    
    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Less than 1h left';
  };

  const isVotingActive = (endTime: number | bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const endTimeNum = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    return now < endTimeNum;
  };

  return (
    <div 
      onClick={onClick}
      className="card hover:shadow-lg cursor-pointer transition-all duration-200 hover:border-blue-400"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {metadata?.project_name || 'Loading...'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {metadata?.description || 'Loading description...'}
          </p>
        </div>
        <div className="ml-4 text-right">
          <div className="text-2xl font-bold text-blue-600">
            {(Number(startupData.funding_goal) / 1e7).toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">XLM Goal</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Vote Statistics */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-green-600 font-medium">{Number(startupData.yes_votes)}</span>
              <span className="text-xs text-gray-500">Yes</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-1">
              <span className="text-red-600 font-medium">{Number(startupData.no_votes)}</span>
              <span className="text-xs text-gray-500">No</span>
            </div>
          </div>
          {/* Approval Rate */}
          {totalVotes > 0 && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              approvalRate >= 70 ? 'bg-green-100 text-green-800' :
              approvalRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {approvalRate}% approval
            </div>
          )}

          {/* Status Badge */}
          {startupData.approved && (
            <span className="badge badge-success">Approved</span>
          )}
        </div>

        {/* Voting Status */}
        <div className="text-right">
          <div className={`text-sm font-medium ${
            isVotingActive(startupData.voting_end_time) ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {getTimeRemaining(startupData.voting_end_time)}
          </div>
          <div className="text-xs text-gray-500">
            {isVotingActive(startupData.voting_end_time) ? 'Voting open' : 'Voting closed'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PublicStartupDirectory = ({ onConnectWallet }: { onConnectWallet: () => void }) => {
  const [viewingAddress, setViewingAddress] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'ending'>('recent');

  // Fetch all startups
  const { data: allStartups = [] } = useQuery({
    queryKey: ['allStartups'],
    queryFn: getAllStartups,
    refetchInterval: 30000,
  });

  // Fetch startup data for detailed view
  const { data: startupData, isLoading } = useQuery({
    queryKey: ['publicStartup', viewingAddress],
    queryFn: () => viewingAddress ? getStartupStatus(viewingAddress) : null,
    enabled: !!viewingAddress,
    refetchInterval: 10000,
  });

  // Fetch IPFS metadata for viewing startup
  const { data: metadata, isLoading: metadataLoading } = useIPFSMetadata(startupData?.ipfs_cid);

  const getTimeRemaining = (endTime: number | bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const endTimeNum = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    const remaining = endTimeNum - now;
    
    if (remaining <= 0) return 'Voting ended';
    
    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remaining % (60 * 60)) / 60);
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const isVotingActive = (endTime: number | bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const endTimeNum = typeof endTime === 'bigint' ? Number(endTime) : endTime;
    return now < endTimeNum;
  };

  // If viewing a specific startup, show detailed view
  if (viewingAddress) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setViewingAddress(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Directory
        </button>

        {isLoading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        ) : startupData ? (
          <>
            {/* Application Details */}
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {metadata?.project_name || 'Loading...'}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Founder: {viewingAddress.slice(0, 8)}...{viewingAddress.slice(-8)}</span>
                    <span>•</span>
                    <span>Goal: {(Number(startupData.funding_goal) / 1e7).toFixed(0)} XLM</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isVotingActive(startupData.voting_end_time)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isVotingActive(startupData.voting_end_time) ? 'Voting Open' : 'Voting Closed'}
                </div>
              </div>
              {metadataLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ) : metadata ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{metadata.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Project URL</h3>
                    <a
                      href={metadata.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {metadata.project_url}
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Information</h3>
                    <p className="text-gray-700 leading-relaxed">{metadata.team_info}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">Unable to load project metadata from IPFS</p>
                </div>
              )}
            </div>

            {/* Voting Results */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Votes</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {Number(startupData.yes_votes)}
                  </div>
                  <div className="text-sm text-gray-600">Yes Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {Number(startupData.no_votes)}
                  </div>
                  <div className="text-sm text-gray-600">No Votes</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Community Sentiment</span>
                  <span>
                    {Number(startupData.yes_votes) + Number(startupData.no_votes) > 0
                      ? `${Math.round((Number(startupData.yes_votes) / (Number(startupData.yes_votes) + Number(startupData.no_votes))) * 100)}% approval`
                      : 'No votes yet'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Number(startupData.yes_votes) + Number(startupData.no_votes) > 0
                        ? (Number(startupData.yes_votes) / (Number(startupData.yes_votes) + Number(startupData.no_votes))) * 100
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 mb-6">
                {getTimeRemaining(startupData.voting_end_time)}
              </div>

              {/* Connect to Vote */}
              <div className="text-center py-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="text-blue-900 font-semibold mb-2">Want to vote on this application?</div>
                <div className="text-sm text-blue-700 mb-4">Connect your wallet to participate in DAO governance</div>
                <button
                  onClick={onConnectWallet}
                  className="btn btn-primary px-6 py-2"
                >
                  Connect Wallet to Vote
                </button>
              </div>
            </div>

            {/* Admin Status */}
            {startupData.approved && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center">
                  <div className="text-green-600 font-semibold">✓ Application Approved</div>
                  <div className="ml-auto">
                    <span className="badge badge-success">Ready for Investment</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <div className="text-gray-600">Application not found</div>
          </div>
        )}
      </div>
    );
  }
  // Main directory view
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Startup Directory</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Browse startup applications and see community votes. Connect your wallet to participate in voting.
        </p>
        <button
          onClick={onConnectWallet}
          className="btn btn-primary px-8 py-3 text-lg font-semibold"
        >
          Connect Wallet to Vote
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{allStartups.length}</div>
          <div className="text-gray-600">Total Applications</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">7</div>
          <div className="text-gray-600">Days to Vote</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
          <div className="text-gray-600">Transparent</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Applications</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'votes' | 'ending')}
              className="form-input py-1 px-3 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="votes">Most Votes</option>
              <option value="ending">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Startup Directory */}
      {allStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allStartups.map((address: string) => (
            <PublicStartupCard
              key={address}
              address={address}
              onClick={() => setViewingAddress(address)}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-gray-600 mb-4">No applications found</div>
          <p className="text-sm text-gray-500">
            Be the first to submit an application or check back later for new startups.
          </p>
        </div>
      )}

      {/* Connect to Participate */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Participate?</h3>
        <p className="text-lg mb-6 opacity-90">
          Connect your wallet to vote on applications, apply as a founder, or invest as a VC
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onConnectWallet}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};