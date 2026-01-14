# ForBirra20Venti

**ForBirra20Venti** is the official repository of the **Birra20Venti** digital infrastructure, developed inside the **ChainIntegrate** ecosystem.

It brings together craft beer production, e-commerce, blockchain, and digital identity into a single, verifiable system.

This repository is not a demo: it powers a real brewery, real customers, and real on-chain assets.

---

## What this project is

Birra20Venti is a craft beer brand evolving into a **digitally verifiable producer**.

Every bottle, batch, badge, and certificate can be:
- generated off-chain  
- cryptographically hashed  
- anchored on-chain  
- verified by anyone  

This repository contains the full technical stack that makes that possible.

---

## Main components

### Web Applications
- Shop (product catalog, cart, checkout)
- Loyalty & NFT dashboard
- Certificate and batch viewers
- Verification portals

### Backend (PHP)
- Order processing  
- JSON data storage (purchases, stock, batches)  
- Secure session handling  
- Signature-based wallet login  
- Webhooks (Stripe, payments)

### Blockchain Layer (LUKSO)
- LSP7 tokens for loyalty, badges and points  
- LSP8 NFTs for:
  - production batches  
  - limited editions  
  - compliance & quality certificates  

Includes:
- minting  
- revocation  
- superseding  
- metadata freezing  
- on-chain verification  

---

## Why this exists

This repo demonstrates how a **small physical producer** can become a **trust-native digital brand**.

No black boxes.  
No unverifiable PDFs.  
No centralized certificates.

Everything can be:
- checked  
- hashed  
- compared  
- and proven  

From a single bottle to an entire production history.

---

## Architecture philosophy

The system is designed around:
- off-chain data (JSON, PDFs, orders, stock)  
- cryptographic hashes  
- on-chain anchors (LUKSO)  
- secure PHP proxies and sessions  
- wallet-based identity (Universal Profiles)  

Nothing important is trusted blindly.  
Everything important is verifiable.

---

## Who this is for

This repository is built for:
- Birra20Venti customers  
- auditors and partners  
- blockchain developers  
- producers exploring digital product passports  
- anyone who wants to understand how real-world goods can live on-chain  

---

## Part of ChainIntegrate

**ForBirra20Venti** is a production-grade reference implementation of the **ChainIntegrate** vision:  
connecting ERP, documents, products and compliance to blockchain-based verification.

It is both:
- a working brewery system  
- and a blueprint for other industries.  

---

## License

This repository contains both open and proprietary components related to Birra20Venti and ChainIntegrate.  
Use and reuse should be evaluated case by case.
