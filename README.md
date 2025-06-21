# CR8OR 🎨
## Decentralised Creator Monetisation Platform

**"Create, Own, Earn."**

*Built for creators, by creators. Experience the future of digital content monetisation.*

---

## 🏆 Lisk Africa Bootcamp - Cohort 1 | Team 3

### 🚀 **Live Application**
- **Website**: [https://cr8or.vercel.app/](https://cr8or.vercel.app/)
- **Pitch Deck**: [https://cr8or-pitch-deck.vercel.app/](https://cr8or-pitch-deck.vercel.app/)

### 📂 **Repositories**
- **Frontend**: [Cr8or-frontend](https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-frontend)
- **Smart Contracts**: [Cr8or-Smartcontracts](https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-Smartcontracts)

---

## 🎯 **Project Overview**

CR8OR is a revolutionary decentralised NFT marketplace that empowers artists, musicians, and digital creators to monetise their content with unprecedented fairness and transparency. Built on the Lisk blockchain, our platform addresses the critical issue of creator exploitation in traditional platforms.

### ✨ **Key Features**

🎵 **Multi-Format NFT Minting**
- Music & Audio NFTs with built-in royalty distribution
- Visual Art NFTs with provable ownership
- Podcast and Digital Content tokenisation

💰 **Creator-First Economics**
- **90% royalty retention** for creators (industry-leading)
- Automated smart contract royalty distribution
- Transparent, blockchain-verified transactions

🔒 **Decentralized Infrastructure**
- IPFS storage for permanent content availability
- Blockchain-verified ownership and authenticity
- Censorship-resistant content hosting

🌍 **Global Marketplace**
- Intuitive discovery and browsing experience
- Worldwide collector reach
- Community-driven platform governance

---

## 🛠️ **Prerequisites for Using/Testing CR8OR**

### **For End Users (Creators & Collectors)**

#### **Essential Requirements:**
1. **Web3 Wallet**
   - MetaMask (Recommended)
   - WalletConnect-compatible wallets
   - Ensure the wallet is configured for the Lisk network

2. **Lisk Network Configuration**
   - Network Name: `Lisk`
   - RPC URL: `https://rpc.api.lisk.com`
   - Chain ID: `1135`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://blockscout.lisk.com`

3. **Test Funds**
   - Lisk ETH for gas fees
   - Available through Lisk faucets or testnet bridges

4. **Digital Content**
   - High-quality images (PNG, JPG, GIF)
   - Audio files (MP3, WAV, FLAC)
   - Video content (MP4, MOV)
   - Maximum file size: 100MB per asset

#### **Browser Requirements:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local storage enabled
- Stable internet connection

---

### **For Developers & Testers**

#### **Development Environment:**

**Frontend Setup:**
```bash
# Clone the repository
git clone https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-frontend.git
cd Cr8or-frontend

# Install dependencies
npm install --legacy-peer-deps
# or
npm install --force --legacy-peer-deps
# or
npm install --force
# or with yarn
yarn install --legacy-peer-deps

# Environment Variables Required:
# Create .env.local file with:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_LISK_RPC_URL=https://rpc.api.lisk.com
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret

# Start development server
npm run dev
```

**Smart Contract Setup:**
```bash
# Clone smart contract repository
git clone https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-Smartcontracts.git
cd Cr8or-Smartcontracts

# Install dependencies
npm install

# Environment Variables Required:
# Create .env file with:
PRIVATE_KEY=0x...
LISK_RPC_URL=https://rpc.api.lisk.com
ETHERSCAN_API_KEY=your_api_key (optional)

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Lisk testnet
npx hardhat run scripts/deploy.js --network lisk
```

#### **Technical Prerequisites:**

**Required Software:**
- Node.js (v18+ recommended)
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

**Development Tools:**
- Hardhat (Smart contract development)
- Next.js (Frontend framework)
- Ethers.js (Blockchain interaction)
- IPFS/Pinata (Decentralised storage)
- Tailwind CSS (Styling)

**Optional Tools:**
- Lisk Blockchain Explorer
- MetaMask Extension
- Postman (API testing)
- Remix IDE (Contract testing)

---

## 🧪 **Testing Guide**

### **User Acceptance Testing:**

1. **Wallet Connection Testing**
   - Connect MetaMask to the Lisk network
   - Verify the wallet address display
   - Test network switching

2. **NFT Minting Flow**
   - Upload various file formats
   - Set metadata (title, description, royalties)
   - Confirm transaction and verify on-chain

3. **Marketplace Functionality**
   - Browse NFT collections
   - Search and filter capabilities
   - Purchase flow completion

4. **Creator Dashboard**
   - View minted NFTs
   - Monitor sales and royalties
   - Access earnings history

### **Performance Testing:**
- File upload speed (various sizes)
- IPFS storage verification
- Smart contract gas optimisation
- Mobile responsiveness

---

## 🔧 **Troubleshooting**

### **Common Issues & Solutions:**

**Wallet Connection Problems:**
- Ensure MetaMask is updated to the latest version
- Clear browser cache and cookies
- Verify Lisk network configuration

**Transaction Failures:**
- Check gas fees and wallet balance
- Verify the smart contract address
- Ensure network connectivity

**File Upload Issues:**
- Verify file size limits (100MB max)
- Check supported formats
- Ensure a stable internet connection

**IPFS Access Problems:**
- Try alternative IPFS gateways
- Verify Pinata API credentials
- Check firewall settings

---

## 🌟 **What Makes CR8OR Special**

### **Innovation Highlights:**
- **Highest Creator Royalties**: 90% creator retention vs. industry standard 2.5%
- **Multi-Format Support**: First platform to seamlessly handle audio, visual, and podcast NFTs
- **IPFS Integration**: Permanent, decentralized content storage
- **Lisk Blockchain**: Low fees, high performance, sustainability
- **Creator-Centric Design**: Built based on actual creator feedback and needs

### **Technical Excellence:**
- Gas-optimised smart contracts
- Progressive Web App (PWA) capabilities
- Responsive, accessible design
- Comprehensive testing suite
- Scalable architecture

### **Social Impact:**
- Empowering underrepresented creators
- Democratising digital content monetisation
- Building a sustainable creator economy
- Fostering a global creative community

---

## 📊 **Project Metrics**

- **Smart Contract Deployments**: Multiple testnet iterations
- **Frontend Performance**: 95+ Lighthouse scores
- **Security Audits**: Self-audited with best practices
- **Test Coverage**: 90%+ contract coverage
- **User Experience**: Intuitive, creator-focused design

---

## 🎖️ **Competition Advantages**

### **Why CR8OR Deserves the Best Project Award:**

1. **Real-World Problem Solving**: Addresses actual creator monetization challenges
2. **Technical Innovation**: Advanced smart contract architecture with IPFS integration
3. **User-Centric Design**: Intuitive interface based on creator feedback
4. **Scalable Architecture**: Built for growth and future expansion
5. **Community Impact**: Empowers creators globally with fair compensation
6. **Complete Solution**: Full-stack application with professional deployment

---

## 👥 **Team 3 Contributors**

*Built with passion by dedicated developers committed to empowering creators worldwide.*

---

## 🔗 **Links & Resources**

- **Live Application**: [cr8or.vercel.app](https://cr8or.vercel.app/)
- **Pitch Deck**: [cr8or-pitch-deck.vercel.app](https://cr8or-pitch-deck.vercel.app/)
- **Frontend Repository**: [GitHub](https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-frontend)
- **Smart Contracts**: [GitHub](https://github.com/Team-3-Lisk-Africa-Bootcamp/Cr8or-Smartcontracts)
- **Lisk Documentation**: [docs.lisk.com](https://docs.lisk.com)

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

*"Create, Own, Earn." - The future of creator monetisation is here.*
