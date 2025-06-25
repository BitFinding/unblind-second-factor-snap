# Semantic Second Factor Snap

**Human-readable transaction insights. Hardware-wallet compatible. Telegram-optional.**

---

## ✨ Overview

Semantic Second Factor Snap is a MetaMask Snap that acts as a semantic second factor for transaction and message signing. It provides out-of-band, human-readable digests of signing requests, sent to your Telegram or shown as a QR code, so you can verify what you're about to sign—even if your browser or dApp is compromised.

---

## Table of Contents

- [Features](#features)
- [Why This Matters](#why-this-matters)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots & GIFs](#Screenshots)
- [Example Flows](#example-flows)
- [Configuration](#configuration)
- [Related Work](#related-work)
- [Feedback & Contributions](#feedback--contributions)
- [License](#license)

---

## Features

- **Out-of-band verification:** Human-readable digests sent to your Telegram or shown as a QR code.
- **Hardware wallet compatible:** Compare the signing hash in the digest with your hardware wallet for extra security.
- **Privacy mode:** Use QR-only mode for maximum privacy—no data sent to Telegram.
- **Companion mobile app:** Scan QR codes on a separate device for air-gapped verification.
- **Reduces trust in dApp/browser:** Even if your browser or MetaMask is compromised, you get an independent, semantic summary of what you're signing.

---

## Why This Matters

Browser wallets and dApps can be compromised. This Snap gives you:
- An out-of-band channel (Telegram or QR) for verifying signing intent.
- A human-readable summary of the signing request (not just hex blobs).
- Optional hardware wallet hash matching for even stronger verification.
- A way to inspect and audit your transactions before approving.

---

## How It Works

1. **Install the Snap** and pair with your Telegram account by scanning a QR code.
2. **On every sign request** (transaction or message), the Snap sends the data to our secure backend for analysis.
3. **Receive a digest**: A natural-language summary is sent to your Telegram or shown as a QR code.
4. **Verify the digest** (and optionally the signing hash with your hardware wallet).
5. **Approve or reject** the request in MetaMask as usual.

---

## Installation

1. **Enable MetaMask Snaps** (requires MetaMask Flask or compatible release).
2. **Install this Snap** from our repo.
3. **Pair with Telegram**: On first run, you'll be shown a QR code to link your Telegram account with our bot.

*Once paired, you're ready to go!*

---

## Usage

- **Telegram Mode:**  
  - One-time QR scan links your wallet to your Telegram account.
  - Human-readable digests appear via our bot.
  - Great UX for everyday use.

- **QR-Only Mode (Private Mode):**  
  - No data sent over Telegram.
  - A QR code appears during each signing request.
  - Scan it using our open-source mobile app on a separate device.
  - Ideal for high-privacy workflows or air-gapped setups.

- **Hardware Wallets:**  
  - Compare the signing hash in the digest with the hash shown on your hardware wallet for maximum confidence.

---

## Screenshots

<p align="center">
  <img src="./screenshots/unblind-pairing-qr.png" width="75%" alt="Pairing QR code" />
</p>
<p align="center"><em>Scan this QR code in MetaMask to link your Telegram account.</em></p>

<p align="center">
  <img src="./screenshots/unblind-telegram-digest.png" width="75%" alt="Telegram digest" />
</p>
<p align="center"><em>Example of a human-readable digest sent to Telegram.</em></p>

<p align="center">
  <img src="./screenshots/unblind-mobile-app-scan.png" width="75%" alt="Mobile app scanning QR" />
</p>
<p align="center"><em>Scan the QR code with our companion app for out-of-band verification.</em></p>

<p align="center">
  <img src="./screenshots/unblind-mobile-app-digest.png" width="75%" alt="Mobile app Analysis" />
</p>
<p align="center"><em>Scan the QR code with our companion app for out-of-band verification.</em></p>

<p align="center">
  <img src="./screenshots/hw-hash.png" width="75%" alt="Hardware wallet hash comparison" />
</p>
<p align="center"><em>Compare the hash in the digest with your hardware wallet.</em></p>

---

## Example Flows

> **Add screenshots or code snippets here to show:**
> - Signing a transaction and receiving a digest in Telegram.
> - Using QR-only mode and scanning with the mobile app.
> - Verifying a signing hash with a hardware wallet.

---

## Configuration

*Coming soon: support for custom destinations, digest formats, and alternate communication channels.*


---

## Feedback & Contributions

We welcome feedback, issue reports, and contributions!  
Open a GitHub issue or contact us via Telegram through the bot.

https://x.com/BitFinding

