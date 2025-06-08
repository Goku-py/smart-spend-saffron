Smart Spend (S₹artSpend) - AI-Driven Budget Tracker for India

  



  A Web3-enabled, AI-powered Progressive Web App (PWA) designed to empower Indian users (18–45) with seamless expense tracking, budgeting, and financial insights, tailored to India’s digital payment ecosystem and cultural spending patterns.



  
  



Overview
Smart Spend is an innovative financial management platform built for urban and semi-urban Indian users. It integrates AI-driven insights, real-time UPI transaction syncing, and blockchain technology to deliver secure, transparent, and culturally relevant budgeting tools. With support for multilingual interfaces (English, Hindi, Telugu) and compliance with India’s DPDP Act 2023 and RBI guidelines, Smart Spend promotes financial discipline through features like shared budgeting, bill splitting, and festival-specific spending analysis.
Vision: To become India’s leading budget tracking platform, empowering users with intuitive, secure, and localized financial tools.
Target Audience:

Urban and semi-urban Indians (18–45 years, ₹3L–₹25L annual income)
UPI users, families, roommates, and small businesses
Tech-savvy and first-time digital users seeking financial literacy


Key Features

Authentication: Multi-channel login (mobile OTP, email, WhatsApp OAuth, Web3 wallet via MetaMask/WalletConnect) with 2FA and biometric support.
Expense Tracking: Manual entry, UPI auto-sync (NPCI APIs), AI-driven categorization (e.g., “Kirana”, “Festivals”), and OCR for receipt scanning.
Budget Management: INR-based budgets with real-time overspending alerts and smart contract-based shared budgets for families/roommates.
Financial Insights: AI-powered spending analysis (e.g., “Save ₹2,000 on dining for Diwali”) with dynamic charts (pie, bar, line).
Notifications: Multilingual alerts (English, Hindi, Telugu) via SMS, email, WhatsApp, and decentralized Push Protocol.
Web3 Integration: Transaction logging on Polygon, decentralized storage (IPFS/Arweave), and smart contracts for budget sharing and bill splitting.
Cultural Relevance: Festive themes (Diwali, Holi), local terms (e.g., “Pandit ji dakshina”), and vernacular UI.
Security: End-to-end encryption, DPDP Act/RBI compliance, and audited smart contracts.
Accessibility: WCAG 2.1 AA compliant with high-contrast mode and text-to-speech support.


Technology Stack



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
TensorFlow (categorization), GPT-3.5 (insights)


APIs
NPCI UPI, Razorpay, MSG91 (SMS), SendGrid (email)


Deployment
Vercel (Edge Functions), AWS Mumbai/DigitalOcean Bangalore


Typography
Poppins (English), Noto Sans Devanagari (Hindi), Noto Sans Telugu (Telugu)



Installation
Prerequisites

Node.js: v18 or higher
Supabase CLI: For local database setup
MetaMask/WalletConnect: For Web3 testing
Package Manager: npm or Yarn
Polygon Node: Access via Alchemy or Infura

Setup Instructions

Clone the Repository:
git clone https://github.com/<your-repo>/smart-spend.git
cd smart-spend


Install Dependencies:
npm install
# or
yarn install


Initialize Supabase:
supabase init
supabase start


Configure Environment Variables:Create a .env.local file in the root directory:
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

Use Hardhat or Truffle to deploy contracts/SmartSpend.sol to Polygon.
Update .env.local with the contract address.


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
Set initial budget with AI-suggested categories.


Dashboard:

View INR balance, recent UPI transactions, and AI insights (e.g., “Reduce chai expenses by ₹500/week”).
Use quick actions for expense entry or UPI payments.


Expense Tracking:

Add expenses manually or via UPI auto-sync.
Upload kirana bills for OCR processing (stored on IPFS).
Confirm AI categorizations; log transactions on Polygon.


Budget Management:

Set budgets (e.g., ₹5,000 for groceries).
Share budgets with family/roommates via smart contracts.
Receive overspending alerts via Push Protocol, SMS, or WhatsApp.


Reports:

Access dynamic charts (pie, bar, line) for spending trends.
Export blockchain-verified reports for tax purposes.


Notifications:

Receive multilingual bill/EMI alerts (e.g., “Jio recharge due”).
Toggle language preferences for notifications.




Project Structure
smart-spend/
├── app/
│   ├── (public)/
│   │   ├── login/           # Authentication page
│   │   ├── signup/          # Registration with language selector
│   ├── (protected)/
│   │   ├── dashboard/       # Budget overview and AI insights
│   │   ├── expenses/        # Expense tracking
│   │   ├── budgets/         # Budget creation and monitoring
│   │   ├── reports/         # Visual analytics
│   │   ├── notifications/   # Alerts and reminders
│   │   ├── profile/         # User settings and wallet management
│   ├── api/
│   │   ├── transactions/    # UPI sync and blockchain logging
│   │   ├── insights/        # AI-driven insights
│   │   ├── notifications/   # Push Protocol integration
├── contracts/
│   ├── SmartSpend.sol       # Polygon smart contract
├── public/
│   ├── assets/              # Images, fonts, static files
├── tests/
│   ├── components/          # Jest + React Testing Library
│   ├── e2e/                 # Playwright for UPI/Web3 flows
├── .env.local               # Environment variables
├── README.md                # This file
├── LICENSE                  # MIT License


Contributing
Contributions are welcome to enhance Smart Spend’s functionality and impact. To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a Pull Request with a detailed description.

Guidelines

Write TypeScript code with strict type checking.
Adhere to Tailwind CSS conventions for styling.
Audit smart contracts using Slither or Mythril.
Test on 4G-throttled networks (Lighthouse CI score >85).
Ensure compliance with RBI guidelines and DPDP Act 2023.
Follow the Code of Conduct.

Run tests before submitting:
npm run test


License
This project is licensed under the MIT License.

Contact
For inquiries, contact the development team at 23ag6734@gmail.com or our internal guide, Mr. Kalvacheria Kiran, at ACE Engineering College, Ankushapur, Ghatkesar, Medchal Dist-501301.
Smart Spend TeamEmpowering India’s financial future with AI, UPI, and Web3.
