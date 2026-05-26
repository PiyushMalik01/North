'use client';

import React, { useState } from 'react';

export const ProblemPanel = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'discussion'>('description');

  return (
    <div className="w-full lg:w-1/2 bg-[var(--background-secondary)] border-r border-[var(--border-color)] flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)] bg-[var(--background-primary)]">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'description'
              ? 'text-[var(--text-primary)] border-b-2 border-[var(--brand-yellow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('solution')}
          className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'solution'
              ? 'text-[var(--text-primary)] border-b-2 border-[var(--brand-yellow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Solution
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors ${
            activeTab === 'discussion'
              ? 'text-[var(--text-primary)] border-b-2 border-[var(--brand-yellow)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Discussion
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs sm:text-sm px-2 py-1 bg-[#238636]/20 text-[#3FB950] rounded border border-[#238636]/40">
                  Easy
                </span>
                <span className="text-xs sm:text-sm text-[var(--text-muted)]">Arrays • Hash Table</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-4">
                Two Sum
              </h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                Given an array of integers <code className="px-2 py-1 bg-[var(--background-primary)] rounded text-[var(--brand-yellow)] text-xs sm:text-sm">nums</code> and an integer{' '}
                <code className="px-2 py-1 bg-[var(--background-primary)] rounded text-[var(--brand-yellow)] text-xs sm:text-sm">target</code>, return{' '}
                <em>indices of the two numbers such that they add up to target</em>.
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-4">
                You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
              </p>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                You can return the answer in any order.
              </p>

              <div className="space-y-4">
                <div className="bg-[var(--background-primary)] border border-[var(--border-color)] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-2">Example 1:</p>
                  <pre className="text-xs sm:text-sm text-[var(--text-secondary)] overflow-x-auto">
                    <code>{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}</code>
                  </pre>
                </div>

                <div className="bg-[var(--background-primary)] border border-[var(--border-color)] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-2">Example 2:</p>
                  <pre className="text-xs sm:text-sm text-[var(--text-secondary)] overflow-x-auto">
                    <code>{`Input: nums = [3,2,4], target = 6
Output: [1,2]`}</code>
                  </pre>
                </div>

                <div className="bg-[var(--background-primary)] border border-[var(--border-color)] rounded-lg p-4">
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-2">Example 3:</p>
                  <pre className="text-xs sm:text-sm text-[var(--text-secondary)] overflow-x-auto">
                    <code>{`Input: nums = [3,3], target = 6
Output: [0,1]`}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-[var(--text-secondary)]">
                  <li><code className="px-1 bg-[var(--background-primary)] rounded text-[var(--brand-yellow)] text-xs sm:text-sm">2 &lt;= nums.length &lt;= 10⁴</code></li>
                  <li><code className="px-1 bg-[var(--background-primary)] rounded text-[var(--brand-yellow)] text-xs sm:text-sm">-10⁹ &lt;= nums[i] &lt;= 10⁹</code></li>
                  <li><code className="px-1 bg-[var(--background-primary)] rounded text-[var(--brand-yellow)] text-xs sm:text-sm">-10⁹ &lt;= target &lt;= 10⁹</code></li>
                  <li>Only one valid answer exists</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Solution Approach</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                This section will contain the optimal solution approach, time complexity analysis, and step-by-step explanation.
              </p>
              <div className="mt-4 p-4 bg-[var(--background-primary)] border border-[var(--border-color)] rounded-lg">
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                  💡 <strong className="text-[var(--text-primary)]">Hint:</strong> Try using a hash map to store complements.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Community Discussion</h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)]">
              Join the discussion with fellow learners. Share your approach, ask questions, and learn together.
            </p>
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p className="text-sm sm:text-base">Discussion feature coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
