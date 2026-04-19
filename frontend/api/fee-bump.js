/**
 * Fee Bump API — Vercel Serverless Function
 *
 * Receives a user-signed inner transaction XDR.
 * Wraps it in a fee bump transaction signed by the sponsor.
 * Submits to Stellar Testnet.
 *
 * The sponsor pays all transaction fees — users need zero XLM.
 */

import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL  = 'https://horizon-testnet.stellar.org';
const PASSPHRASE   = 'Test SDF Network ; September 2015';
const BASE_FEE     = 10000; // 0.001 XLM per operation — generous for fast inclusion

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify secret header — prevents unauthorized use of sponsor wallet
  const secret = req.headers['x-deco-secret'];
  if (!secret || secret !== process.env.FEE_BUMP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { innerTxXdr } = req.body;
  if (!innerTxXdr) return res.status(400).json({ error: 'Missing innerTxXdr' });

  const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
  if (!sponsorSecret) return res.status(500).json({ error: 'Sponsor not configured' });

  try {
    const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);
    const horizon = new StellarSdk.Horizon.Server(HORIZON_URL);

    // Parse the inner transaction
    const innerTx = StellarSdk.TransactionBuilder.fromXDR(innerTxXdr, PASSPHRASE);

    // Wrap in fee bump
    const feeBumpTx = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      String(BASE_FEE),
      innerTx,
      PASSPHRASE
    );

    feeBumpTx.sign(sponsorKeypair);

    // Submit
    const result = await horizon.submitTransaction(feeBumpTx);

    return res.status(200).json({
      hash: result.hash,
      successful: result.successful,
      feePaidBy: sponsorKeypair.publicKey(),
    });
  } catch (error) {
    console.error('Fee bump error:', error);
    const detail = error?.response?.data?.extras?.result_codes || error.message;
    return res.status(500).json({ error: 'Fee bump failed', detail });
  }
}
