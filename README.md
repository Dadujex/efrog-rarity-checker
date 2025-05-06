# eFrog Rarity Checker

A tool for checking the rarity of eFrog NFTs based on their traits and attributes. Live here: https://efrog-rarity-checker.vercel.app/

## Overview

The eFrog Rarity Checker is a utility that allows eFrog NFT holders and enthusiasts to check the rarity of their NFTs. By analyzing the traits and attributes of each eFrog, the tool calculates rarity scores and rankings to help users understand the relative value and uniqueness of their digital assets.

## Local Setup
### Installation

```bash
# Clone the repository
git clone https://github.com/Dadujex/efrog-rarity-checker.git

# Navigate to the project directory
cd efrog-rarity-checker

# Install dependencies
npm install
```

### Usage

```bash
# Start the application
npm run dev
```

Navigate to `http://localhost:5173` in your web browser to access the rarity checker interface.

### Checking Rarity

1. Enter the eFrog NFT ID or connect your wallet to view your collection
2. View the calculated rarity score and breakdown by traits
3. Compare your eFrog to others in the collection

## How Rarity is Calculated

Rarity is calculated using a statistical model that considers the rarity of each trait an Efrog possesses.
Rarity Score for a trait = 1 / (trait occurrence percentage)

The rarer a trait is within the collection, the higher its rarity score. The total rarity score is the sum of all individual trait scores.

*Note: This rarity checker is an unofficial tool*