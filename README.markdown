# Smart Spend Saffron 💸

**Take control of your finances with style and smarts!**  
Smart Spend Saffron is a sleek, AI-powered web app that makes budgeting, expense tracking, and financial planning a breeze. Whether you're saving for a dream vacation or just keeping tabs on daily spending, this app delivers intuitive tools and real-time insights to help you spend smarter.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Goku-py/smart-spend-saffron)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-blue)](https://lovable.dev)

## ✨ Features

- **Track Expenses Easily** 📊: Log transactions and categorize spending in seconds.
- **Smart Budgets** 💡: Set custom budgets and get alerts before you overspend.
- **Real-Time Insights** 📈: Visualize your financial habits with interactive charts.
- **Secure & Private** 🔒: Robust authentication keeps your data safe.
- **Cross-Device Access** 📱: Manage your finances anywhere, anytime.
- **AI-Powered Tips** 🤖: Get personalized advice to optimize your savings.

## 🛠️ Tech Stack

- **Backend**: Nodejs, Supabase for data
- **Frontend**: JavaScript, React, Tailwind CSS
- **Database**: PostgreSQL (production), SQLite (development)
- **AI**: Lovable’s AI-driven development tools
- **Deployment**: Global edge network via Lovable

## 🚀 Get Started

### Prerequisites
- Node.js (for frontend dependencies)
- Git
- A free [Supabase](https://supabase.com) account (optional for backend)

### Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Goku-py/smart-spend-saffron.git
   cd smart-spend-saffron
   ```

2. **Set Up Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   npm install  # For frontend
   ```

4. **Configure Environment**:
   Create a `.env` file:
   ```plaintext
   SECRET_KEY=your-secret-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```

5. **Run the App**:
   ```bash
   npm install
   npm run dev
   ```
   Visit `http://localhost:5000` in your browser.

## 🎯 Usage

1. **Sign Up**: Create an account or log in via Google (powered by Supabase Auth).
2. **Add Transactions**: Input expenses and assign categories like "Groceries" or "Travel."
3. **Set Budgets**: Define monthly limits and track progress.
4. **Explore Insights**: Check the dashboard for spending trends and AI-driven tips.
5. **Stay Synced**: Access your data on any device with real-time updates.

## 📂 Project Structure

```plaintext
smart-spend-saffron/
├── app.py                # Main app entry point
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── static/               # CSS, JS, images
├── templates/            # HTML templates
├── src/                  # React components
├── supabase/             # Supabase client config
└── tests/                # Unit tests
```

## 🤝 Contributing

We love contributions! To get involved:

1. Fork the repo.
2. Create a branch: `git checkout -b feature/awesome-feature`.
3. Commit changes: `git commit -m "Add awesome feature"`.
4. Push: `git push origin feature/awesome-feature`.
5. Open a Pull Request.

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and ensure tests pass.

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## 📬 Contact

Got questions? Reach out!  
- **GitHub**: [Goku-py](https://github.com/Goku-py)  
- **Email**: smartspendsaffron@gmail.com  
- **Project Link**: [Smart Spend Saffron](https://preview--smart-spend-saffron.lovable.app)

---

Spend smart, live better!
