Smart Spend (S₹artSpend) - AI-Driven Budget Tracker for India
 
Smart Spend is a Web3-enabled, AI-powered Progressive Web App (PWA) designed to revolutionize personal financial management for Indian users aged 18–45. It combines seamless UPI integration, AI-driven insights, and blockchain technology to provide secure, culturally relevant budgeting and expense tracking. Tailored to India’s digital payment ecosystem, it supports multilingual interfaces (English, Hindi, Telugu) and promotes financial discipline with features like shared budgeting, bill splitting, and festival-specific spending insights.
Table of Contents

Features
Tech Stack
Installation
Environment Variables
Usage
Project Structure
Contributing
License
Contact

Features

User Authentication: Mobile OTP, email, WhatsApp OAuth, and Web3 wallet (MetaMask/WalletConnect) login with 2FA and biometric support.
Expense Tracking: Manual entry, UPI auto-sync via NPCI APIs, AI categorization (e.g., “Kirana”, “Festivals”), and receipt OCR.
Budget Management: INR-based budgets, real-time overspending alerts, and shared budgets for families/roommates via smart contracts.
Financial Insights: AI-driven spending analysis (e.g., “Save ₹2,000 on dining for Diwali”) with visual reports (charts, graphs).
Notifications: Multilingual alerts (English, Hindi, Telugu) via SMS, email, WhatsApp, and decentralized Push Protocol.
Web3 Integration: Transaction logging on Polygon, decentralized storage (IPFS/Arweave), and smart contracts for budget sharing.
Cultural Relevance: Festive themes (Diwali, Holi), local terms (e.g., “Pandit ji dakshina”), and vernacular UI.
Security: End-to-end encryption, DPDP Act 2023 and RBI compliance, and audited smart contracts.
Accessibility: WCAG 2.1 AA compliant with high-contrast mode and text-to-speech support.

Tech Stack



Component
Technology



Frontend
Next.js 14 (App Router), Tailwind CSS, ShadCN/ui, Visx


State Management
Zustand


Backend
Supabase (Auth, PostgreSQL, Storage), Next.js Route Handlers


Web3
Polygon, Web3.js/Ethers.js, IPFS/Arweave, Chainlink, Push Protocol


AI/ML
TensorFlow (expense categorization), GPT-3.5 (insights)


APIs
NPCI UPI, Razorpay, MSG91 (SMS), SendGrid (email)


Deployment
Vercel (Edge Functions), AWS Mumbai/DigitalOcean Bangalore


Typography
Poppins (English), Noto Sans Devanagari (Hindi), Noto Sans Telugu (Telugu)


Installation
Prerequisites

Node.js 18+
Supabase CLI
MetaMask or WalletConnect (for Web3 testing)
Yarn or npm
Polygon node access (e.g., Alchemy or Infura)

Steps

Clone the Repository:
git clone https://github.com/<your-repo>/smart-spend.git
cd smart-spend


Install Dependencies:
npm install
# or
yarn install


Set Up Supabase:
supabase init
supabase start


Configure Environment Variables:Create a .env.local file in the root directory and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPI_SYNC_SECRET=your_npci_webhook_secret
POLYGON_RPC_URL=your_polygon_rpc_url
CHAINLINK_ORACLE_ADDRESS=your_chainlink_oracle


Run Locally:
npm run dev
# or
yarn dev

Access the app at http://localhost:3000.

Deploy Smart Contracts:

Use Hardhat or Truffle to deploy the SmartSpend.sol contract to Polygon.
Update .env.local with the deployed contract address.


Deploy to Vercel:
vercel --prod



Environment Variables



Variable
Description



NEXT_PUBLIC_SUPABASE_URL
Supabase project URL


NEXT_PUBLIC_SUPABASE_ANON_KEY
Supabase anonymous key


UPI_SYNC_SECRET
NPCI webhook secret for UPI syncing


POLYGON_RPC_URL
Polygon RPC endpoint (e.g., Alchemy)


CHAINLINK_ORACLE_ADDRESS
Chainlink oracle for UPI data integration


Usage

Onboarding:

Select language (English, Hindi, Telugu).
Register via mobile OTP, email, or Web3 wallet.
Link UPI ID/bank account and verify wallet signature.


Dashboard:

View INR balance, recent UPI transactions, and AI insights.
Use quick actions to add expenses or request UPI payments.


Expense Tracking:

Add expenses manually or via UPI auto-sync.
Upload kirana bills for OCR processing (stored on IPFS).
Confirm AI categorizations; transactions logged on Polygon.


Budget Management:

Set budgets (e.g., ₹5,000 for groceries).
Share budgets with family/roommates via smart contracts.
Receive overspending alerts via Push Protocol or SMS.


Reports:

View spending trends (pie charts, bar graphs) in vernacular.
Export blockchain-verified reports for tax purposes.


Notifications:

Receive bill/EMI alerts via SMS, WhatsApp, or decentralized notifications.
Toggle language for alerts.



Project Structure
/smart-spend
├── /app
│   ├── /(public)
│   │   ├── /login           # Authentication page
│   │   ├── /signup          # Registration with language selector
│   ├── /(protected)
│   │   ├── /dashboard       # Budget overview and AI insights
│   │   ├── /expenses        # Expense tracking
│   │   ├── /budgets         # Budget creation and monitoring
│   │   ├── /reports         # Visual analytics
│   │   ├── /notifications   # Alerts and reminders
│   │   ├── /profile         # User settings and wallet management
│   ├── /api
│   │   ├── /transactions    # UPI sync and blockchain logging
│   │   ├── /insights        # AI-driven insights
│   │   ├── /notifications   # Push Protocol integration
├── /contracts
│   ├── SmartSpend.sol       # Polygon smart contract for transactions/budgets
├── /public
│   ├── /assets              # Images, fonts, and static files
├── /tests
│   ├── /components          # Jest + React Testing Library
│   ├── /e2e                # Playwright for UPI/Web3 flows
├── .env.local               # Environment variables
├── README.md                # This file

Contributing
We welcome contributions to enhance Smart Spend! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request with a clear description.

Please follow our Code of Conduct and ensure tests pass (npm run test).
Development Guidelines

Use TypeScript for type safety.
Follow Tailwind CSS conventions for styling.
Ensure smart contracts are audited using Slither or Mythril.
Test on 4G-throttled networks (Lighthouse CI score >85).
Maintain RBI/DPDP Act compliance for data handling.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For inquiries, reach out to the team at [insert contact email] or our internal guide, Mr. Kalvacheria Kiran, at ACE Engineering College.
Happy Budgeting with SmartSpend! 🪔💸
