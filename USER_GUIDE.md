# DeCo User Guide

Step-by-step guide for using the DeCo platform. No prior blockchain experience required.

**Live app:** https://frontend-eight-navy-19.vercel.app

---

## Before You Start

You need **Freighter wallet** — a browser extension for Stellar.

1. Install Freighter: https://www.freighter.app
2. Create a new wallet and save your seed phrase
3. Open Freighter → click the network name at the top → select **Testnet**
4. You do **not** need any XLM — DeCo pays all transaction fees for you

---

## For Founders

### Submit an Application

1. Go to https://frontend-eight-navy-19.vercel.app
2. Click **Connect** in the top right → approve in Freighter
3. You'll land on **My Application**
4. Fill in:
   - **Project Name** — your startup's name
   - **Description** — what you're building and why
   - **Project URL** — GitHub, website, or deck link
   - **Team Information** — founder names, roles, background
   - **Funding Goal** — amount in XLM you want to raise
5. Optional: toggle **Milestone-Based Vesting** if you want funds released in tranches
   - Set the number of milestones (2–10)
   - VCs will vote to approve each milestone before funds release
6. Click **Submit Application**
7. Freighter will pop up — review and click **Approve**
8. Wait ~10 seconds for confirmation

Your application is now live on the Stellar blockchain. A 30-day community voting window opens immediately.

### Track Your Application

After submitting, your dashboard shows:
- **Status** — Pending or Approved
- **Community Votes** — live yes/no count with approval percentage
- **Total Allocated** — how much VCs have invested
- **Claim Funds** — withdraw invested XLM to your wallet (non-milestone)
- **Milestone Vesting** — progress bar, vote tally, release button (milestone mode)

### Claim Funds (Non-Milestone)

1. Go to **My Application**
2. Scroll to **Claim Funds**
3. Click **Claim Funds** when balance is available
4. Approve in Freighter

### Release a Milestone Tranche

1. Go to **My Application** → **Milestone Vesting**
2. Wait for VCs who invested to vote (they see an Approve/Reject button)
3. Once majority approves, the **Release Milestone** button activates
4. Click it and approve in Freighter
5. Funds transfer to your wallet instantly

### Message a VC

1. Scroll to **Messages from VCs** in your dashboard
2. Click any VC address to open a chat
3. Type and send — messages are real-time via Supabase

---

## For Community Voters

### Vote on a Startup

1. Connect your Freighter wallet (any Stellar wallet works)
2. Click **Vote** in the navigation
3. Browse the startup directory — click any card to open it
4. Read the description, team info, and funding goal
5. Click **Vote Yes** or **Vote No**
6. Approve in Freighter

Rules:
- One vote per wallet per startup
- Voting window is 30 days from application date
- Votes are permanent and on-chain — cannot be changed

---

## For VCs (Venture Capitalists)

### Become a Verified VC

1. Connect your Freighter wallet
2. Click **Become VC** in the navigation
3. Enter your company or fund name
4. Click **Stake 1000 XLM to Become VC**
5. Approve in Freighter

The 1000 XLM stake is your credential — no admin approval needed. You can start investing immediately.

> Don't have 1000 XLM? Get free testnet XLM at https://friendbot.stellar.org

### Invest in a Startup

1. Go to **VC Dashboard**
2. Browse the startup list or search by founder address
3. Click a startup to view details
4. Enter an investment amount in XLM
5. Click **Invest Now** (or **Invest (Escrowed)** for milestone startups)
6. Approve in Freighter

For milestone-enabled startups, your funds go into escrow and are released in tranches as you vote to approve each milestone.

### Vote on a Milestone

After investing in a milestone-enabled startup:

1. Go to **VC Dashboard** → find the startup
2. Scroll to **Vote on Milestone #N**
3. Click **Approve** or **Reject**
4. Approve in Freighter

Once a majority of investors approve, the founder can release the tranche.

### Message a Founder

1. Go to **VC Dashboard** → view any startup
2. Scroll to **Direct Message**
3. Click **Message Founder**
4. Chat opens in the bottom right corner

---

## Notifications

DeCo sends browser notifications when you receive a new message while the tab is in the background.

- First time: your browser will ask for notification permission — click **Allow**
- Unread message counts appear as badges on chat buttons and nav tabs

---

## Troubleshooting

**"Transaction was cancelled in Freighter"**
You clicked Reject in the Freighter popup. Try again and click Approve.

**"Wrong network in Freighter"**
Open Freighter → click the network name → select Testnet.

**"You have already submitted an application"**
Each wallet can only apply once. Use a different wallet if you want to test again.

**"Milestone not approved by majority"**
Not enough VCs have voted to approve yet. Share the platform with your investors and ask them to vote.

**Chat not loading**
Refresh the page. If the issue persists, check your internet connection.

---

## Contract Information

| Field | Value |
|---|---|
| Network | Stellar Testnet |
| Contract ID | `CDEIL2ZNURMZP66QIWTLZ5SPG4MDVT6UFWTPLSDE6B2R3N6UJEMV7KND` |
| Explorer | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDEIL2ZNURMZP66QIWTLZ5SPG4MDVT6UFWTPLSDE6B2R3N6UJEMV7KND) |
| VC Stake | 1000 XLM |
| Voting Period | 30 days |
| Platform Fee | 0% |

---

*Last updated: April 2026*
