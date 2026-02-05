Implementation Plan - Dream Garden Web App
This plan outlines the steps to build the Dream Garden web application using React, Vite, and the requested Stable Layer SDK.

User Review Required
IMPORTANT

Stable Layer SDK Integration: User confirmed stable-layer-sdk is available via npm.
Vault Balance: The "Vault Balance" will be determined by the user's balance of btcUSDC coins (1 USDC deposit = 1 btcUSDC).
SDK Logic: Deposit will use buildMintTx and Withdraw will use buildBurnTx. Reference: 
e2e/client.test.ts
.
Proposed Changes
Project Structure
I will create a new Vite project named dream-garden-app in the root directory.

Dependency Installation
react, react-dom
react-router-dom: For navigation between pages.
tailwindcss, postcss, autoprefixer: For styling.
@mysten/dapp-kit, @mysten/sui.js, @tanstack/react-query: For Sui Wallet and Blockchain interaction.
stable-layer-sdk: For deposit/withdraw functionality.
UI Implementation
I will migrate the provided HTML designs into React components.

Layout & Components

Layout.tsx: Includes the Header with the Connect Wallet button.
Header.tsx: Navigation bar with wallet status.
Pages

LandingPage.tsx (from 
noseed.html
):
Display "Plant My Seed" call to action.
Button navigates to /plant.
PlantSeedPage.tsx (from 
plantseed.html
):
Form to input "Dream Item", "Icon", and "Goal Amount".
"Plant My Seed" button triggers creation logic (mocked for now) and redirects to /dashboard.
DashboardPage.tsx (from 
homepagewithseed.html
):
Displays Vault Balance (Sui integration).
Buttons:
"Add Water" -> Triggers Stable Layer SDK deposit.
"Cancel Dream" -> Opens GiveUpModal.
Visuals: Progress bar, plant animations from CSS.
Modals

GiveUpModal.tsx (from 
giveupdream.html
):
"Keep Growing" closes modal.
"Take Back Gold & Restart" triggers Stable Layer SDK withdraw and redirects to /.
Logic & Integration
Sui Provider: Wrap the app in <SuiClientProvider> and <WalletProvider>.
Navigation: Configure routes: /, /plant, /dashboard.
Stable Layer SDK:
Deposit (Mint): Use sdk.buildMintTx to swap USDC for btcUSDC.
Withdraw (Burn): Use sdk.buildBurnTx to swap btcUSDC back to USDC.
Balance: Query the user's btcUSDC coin balance using suiClient.getBalance or useSuiClientQuery.
Verification Plan
Automated Tests
I will verify the project builds successfully with npm run build.
Manual Verification
Flow Test:
Start app (npm run dev).
Connect Wallet (Simulated or Real).
Click "Plant My Seed". Verification: Navigates to /plant.
Fill form and Submit. Verification: Navigates to /dashboard.
Click "Add Water". Verification: Check console/SDK for deposit trigger.
Click "Cancel Dream" -> "Take Back Gold". Verification: Check console/SDK for withdraw trigger and redirect to /.
Responsiveness:
Check UI on mobile/desktop viewports (visually using the browser tool).