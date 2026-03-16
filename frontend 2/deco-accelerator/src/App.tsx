/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Users, Zap, Globe, Wallet } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="font-bold tracking-tighter text-2xl">DeCo</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#" className="hover:opacity-50 transition-opacity">Founders</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Community</a>
            <a href="#" className="hover:opacity-50 transition-opacity">VCs</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Docs</a>
          </div>

          <button className="px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-2">
            <Wallet size={16} />
            Connect
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                Stellar Soroban Network
              </div>
              
              <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                THE FUTURE <br />
                <span className="italic font-serif font-light">OF FUNDING</span>
              </h1>
              
              <p className="text-xl text-zinc-600 max-w-lg leading-relaxed mb-10">
                DeCo is a fully decentralized accelerator platform. Apply for funding, 
                vote on projects, and invest directly through DAO governance on Stellar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                  Apply for Funding
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                  Explore DAO
                </button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-black/5 pt-8">
                <div>
                  <div className="text-2xl font-bold tracking-tighter">1000+ XLM</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-1">VC Stake</div>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tighter">7 DAYS</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Voting Period</div>
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tighter">IPFS</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Storage</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-zinc-50 border border-black/5 flex items-center justify-center overflow-hidden"
            >
              {/* Abstract Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
              
              <div className="relative z-10 w-full max-w-md p-8 bg-white border border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active Proposal</div>
                    <div className="text-xl font-bold tracking-tight">Stellar Nexus Protocol</div>
                  </div>
                  <div className="px-2 py-1 bg-black text-white text-[10px] font-bold">DAO-042</div>
                </div>

                <div className="space-y-6">
                  <div className="h-2 w-full bg-zinc-100 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-black"
                    />
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>75% YES</span>
                    <span className="text-zinc-400">25% NO</span>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 border border-black/5">
                    <Users size={20} className="mb-3" />
                    <div className="text-xs font-bold uppercase tracking-wider">Community</div>
                    <div className="text-lg font-bold tracking-tight">1.2k Votes</div>
                  </div>
                  <div className="p-4 bg-zinc-50 border border-black/5">
                    <Shield size={20} className="mb-3" />
                    <div className="text-xs font-bold uppercase tracking-wider">Security</div>
                    <div className="text-lg font-bold tracking-tight">Verified</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 right-10 w-24 h-24 border border-black/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 border border-black/5 rotate-45"></div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight uppercase">Smart Accelerator</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automated milestone-based funding release through Soroban smart contracts. No middleman, just code.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight uppercase">IPFS Integration</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Metadata stored permanently on IPFS for 95% storage reduction while maintaining full decentralization.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight uppercase">DAO Governance</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                7-day public voting periods ensure community-driven project selection and sybil-resistant approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Micro */}
      <footer className="py-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <span className="text-white font-bold text-xs">D</span>
            </div>
            <span className="font-bold tracking-tighter">DeCo</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            Built on Stellar Soroban • 2026
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
