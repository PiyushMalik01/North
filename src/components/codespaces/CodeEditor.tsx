'use client';

import React, { useState } from 'react';

const languages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
];

const initialCode = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
};

export const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(initialCode.javascript);
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    setCode(initialCode[langId as keyof typeof initialCode]);
  };

  const handleRunCode = () => {
    setShowOutput(true);
    setOutput('Running your code...\n\nTest Case 1: Passed ✓\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExpected: [0,1]\n\nExecution Time: 52ms');
  };

  const handleSubmit = () => {
    setShowOutput(true);
    setOutput('Submitting your solution...\n\nAll test cases passed! ✓\n\nYour submission has been accepted.\nRuntime: 52ms (Beats 95.2%)\nMemory: 41.2MB (Beats 87.4%)');
  };

  return (
    <div className="w-full lg:w-1/2 bg-[var(--background-primary)] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--background-secondary)] px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[var(--background-primary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg focus:outline-none focus:border-[var(--brand-yellow)] transition-colors"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 sm:p-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 sm:p-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleRunCode}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--background-secondary)] hover:bg-[var(--card-hover)] text-[var(--text-primary)] text-xs sm:text-sm font-medium rounded-lg border border-[var(--border-color)] transition-colors flex items-center gap-1.5 sm:gap-2"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Run</span>
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#238636] dark:bg-[#238636] hover:bg-[#2EA043] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-[var(--background-primary)] text-[var(--text-secondary)] font-mono text-xs sm:text-sm p-3 sm:p-4 lg:p-6 focus:outline-none resize-none overflow-auto leading-relaxed"
          style={{
            fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
            tabSize: 4,
          }}
          spellCheck={false}
        />

        {/* Output Panel */}
        {showOutput && (
          <div className="border-t border-[var(--border-color)] bg-[var(--background-secondary)] max-h-[40%] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-3 sm:px-4 py-2">
              <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">Output</span>
              <button
                onClick={() => setShowOutput(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <pre className="p-3 sm:p-4 text-xs sm:text-sm text-[var(--text-secondary)] font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-[var(--border-color)] bg-[var(--background-secondary)] px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden sm:inline">Test Cases</span>
          </div>
          <span className="hidden md:inline">|</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">—</span>
          </div>
        </div>
        
        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>
    </div>
  );
};
