// Unlimited Dollar Airdrop Logic
const tokenAddress = "0xYourUnlimitedDollarTokenAddress"; // placeholder
const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Config
const MIN_HOLD = ethers.utils.parseUnits("200000", 18);
const MAX_REWARD = ethers.utils.parseUnits("5000000", 18); // 5M cap
const rewardTiers = [
  { min: "200000", max: "500000", reward: "50000" },
  { min: "500000", max: "1000000", reward: "150000" },
  { min: "1000000", max: "2000000", reward: "500000" },
  { min: "2000000", max: "5000000", reward: "1000000" }
];

let provider, signer, tokenContract, currentAccount;

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = await signer.getAddress();

  document.getElementById("walletAddress").innerText = currentAccount;
  document.getElementById("connectWallet").innerText = "Connected";

  tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

  await refreshWalletInfo();
  document.getElementById("takeSnapshot").disabled = false;
}

async function refreshWalletInfo() {
  if (!currentAccount) return;

  try {
    const bal = await tokenContract.balanceOf(currentAccount);
    const balFormatted = ethers.utils.formatUnits(bal, 18);
    document.getElementById("tokenBalance").innerText = balFormatted;

    updateStatus("Wallet connected. Balance loaded.");
  } catch (e) {
    console.error(e);
    updateStatus("Error fetching balance");
  }
}

function takeSnapshot() {
  if (!currentAccount) return;

  const balance = document.getElementById("tokenBalance").innerText;
  const balanceWei = ethers.utils.parseUnits(balance, 18);

  if (balanceWei.lt(MIN_HOLD)) {
    document.getElementById("eligibilityStatus").innerText = "Not Eligible";
    updateStatus("You must hold at least 200k UDOLLAR to be eligible.");
    return;
  }

  localStorage.setItem(`snapshot_${currentAccount}`, balance);
  document.getElementById("snapshotBalance").innerText = balance;

  document.getElementById("eligibilityStatus").innerText = "Eligible";

  // calculate reward
  let reward = calcReward(balanceWei);
  let rewardTokens = ethers.utils.formatUnits(reward, 18);

  document.getElementById("claimableAmount").innerText = rewardTokens;
  document.getElementById("claimButton").disabled = false;
  document.getElementById("claimButton").innerText = "Claim Airdrop";
  updateStatus("Snapshot taken. You can now claim.");
}

function calcReward(balanceWei) {
  let reward = ethers.BigNumber.from(0);

  for (let tier of rewardTiers) {
    const min = ethers.utils.parseUnits(tier.min, 18);
    const max = ethers.utils.parseUnits(tier.max, 18);
    if (balanceWei.gte(min) && balanceWei.lte(max)) {
      reward = ethers.utils.parseUnits(tier.reward, 18);
      break;
    }
  }

  if (balanceWei.gt(ethers.utils.parseUnits("5000000", 18))) {
    reward = MAX_REWARD;
  }

  return reward;
}

async function claimAirdrop() {
  if (!currentAccount) return;
  // Here you would call the claim function of your airdrop contract
  updateStatus("Claim transaction submitted (demo placeholder).");
}

// Status display
function updateStatus(msg) {
  document.getElementById("status").innerText = msg;
}

// Time updater
setInterval(() => {
  const now = new Date();
  document.getElementById("currentTime").innerText = now.toUTCString();
}, 1000);

// Event listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("takeSnapshot").addEventListener("click", takeSnapshot);
document.getElementById("claimButton").addEventListener("click", claimAirdrop);

// Refresh button
document.getElementById("refreshBtn").addEventListener("click", () => {
  window.scrollTo({top: 0, left: 0, behavior: "smooth"});
  setTimeout(() => location.reload(), 200);
});
