import * as StellarSdk from '@stellar/stellar-sdk';
import { CONTRACT_ID, SOROBAN_RPC_URL, NETWORK_PASSPHRASE, HORIZON_URL } from './config';

const horizon = new StellarSdk.Horizon.Server(HORIZON_URL);
export const server = new StellarSdk.rpc.Server(SOROBAN_RPC_URL);

const DUMMY = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
let _id = 1;

const ensureFunded = async (address: string) => {
  try {
    await horizon.loadAccount(address);
  } catch {
    const res = await fetch(`https://friendbot.stellar.org/?addr=${address}`);
    if (!res.ok) throw new Error('Auto-funding failed. Visit friendbot.stellar.org manually.');
    await new Promise(r => setTimeout(r, 3000));
  }
};

export const getAccount = async (address: string) => {
  await ensureFunded(address);
  const acc = await horizon.loadAccount(address);
  return new StellarSdk.Account(acc.accountId(), acc.sequenceNumber());
};

const simulate = async (txXdr: string) => {
  const res = await fetch(SOROBAN_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: _id++,
      method: 'simulateTransaction',
      params: { transaction: txXdr },
    }),
  });
  const json = await res.json();
  const xdr = json?.result?.results?.[0]?.xdr;
  if (!xdr) return null;
  return StellarSdk.scValToNative(StellarSdk.xdr.ScVal.fromXDR(xdr, 'base64'));
};

const buildTx = async (source: string, op: StellarSdk.xdr.Operation) => {
  const account = await getAccount(source);
  return new StellarSdk.TransactionBuilder(account, {
    fee: '100',
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(op).setTimeout(30).build().toXDR();
};

export const getStartupStatus = async (founderAddress: string) => {
  try {
    if (!founderAddress) return null;
    StellarSdk.StrKey.decodeEd25519PublicKey(founderAddress);
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      founderAddress,
      contract.call('get_startup_status', StellarSdk.Address.fromString(founderAddress).toScVal())
    );
    const result = await simulate(txXdr);
    if (!result || result.exists === false) return null;
    return result;
  } catch {
    return null;
  }
};

export const getAdmin = async (): Promise<string | null> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(DUMMY, contract.call('get_admin'));
    return await simulate(txXdr);
  } catch {
    return null;
  }
};

export const getAllStartups = async (): Promise<string[]> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(DUMMY, contract.call('get_all_startups'));
    return (await simulate(txXdr)) ?? [];
  } catch {
    return [];
  }
};

export const getVCStakeRequired = async (): Promise<string> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(DUMMY, contract.call('get_vc_stake_required'));
    return (await simulate(txXdr))?.toString() ?? '0';
  } catch {
    return '0';
  }
};

export const getVCData = async (vcAddress: string) => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      DUMMY,
      contract.call('get_vc_data', StellarSdk.Address.fromString(vcAddress).toScVal())
    );
    const result = await simulate(txXdr);
    if (!result || result.exists === false) return null;
    return result;
  } catch {
    return null;
  }
};

export const getAllVCs = async (): Promise<string[]> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(DUMMY, contract.call('get_all_vcs'));
    return (await simulate(txXdr)) ?? [];
  } catch {
    return [];
  }
};

export const getVCInvestment = async (vc: string, founder: string): Promise<string> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      DUMMY,
      contract.call(
        'get_vc_investment',
        StellarSdk.Address.fromString(vc).toScVal(),
        StellarSdk.Address.fromString(founder).toScVal()
      )
    );
    return (await simulate(txXdr))?.toString() ?? '0';
  } catch {
    return '0';
  }
};

export const getStartupInvestors = async (founder: string): Promise<string[]> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      DUMMY,
      contract.call('get_startup_investors', StellarSdk.Address.fromString(founder).toScVal())
    );
    return (await simulate(txXdr)) ?? [];
  } catch {
    return [];
  }
};

export const hasVotedMilestone = async (vc: string, founder: string, milestone: number): Promise<boolean> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      DUMMY,
      contract.call(
        'has_voted_milestone',
        StellarSdk.Address.fromString(vc).toScVal(),
        StellarSdk.Address.fromString(founder).toScVal(),
        StellarSdk.nativeToScVal(milestone, { type: 'u32' })
      )
    );
    return (await simulate(txXdr)) ?? false;
  } catch {
    return false;
  }
};

export const getMilestoneVoteTally = async (founder: string): Promise<[number, number]> => {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const txXdr = await buildTx(
      DUMMY,
      contract.call('get_milestone_vote_tally', StellarSdk.Address.fromString(founder).toScVal())
    );
    const result = await simulate(txXdr);
    if (Array.isArray(result) && result.length === 2) return [Number(result[0]), Number(result[1])];
    return [0, 0];
  } catch {
    return [0, 0];
  }
};

export const submitWithFeeBump = async (
  signedTx: StellarSdk.Transaction | StellarSdk.FeeBumpTransaction
): Promise<{ hash: string }> => {
  try {
    const res = await fetch('/api/fee-bump', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-deco-secret': import.meta.env.VITE_FEE_BUMP_SECRET || '',
      },
      body: JSON.stringify({ innerTxXdr: signedTx.toXDR() }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Fee bump failed: ${res.status}`);
    }

    const data = await res.json();
    return { hash: data.hash };
  } catch {
    // fallback: user pays their own fee
    const result = await server.sendTransaction(signedTx as StellarSdk.Transaction);
    return { hash: result.hash };
  }
};
