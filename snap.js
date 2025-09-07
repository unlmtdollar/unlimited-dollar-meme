// ====== CONFIGURATION ======
const AIRDROP_CONTRACT_ADDRESS = "0x9D841b25589EeC6E598D8FfE1d607e247F42269b"; // replace with your deployed address
const TOKEN_CONTRACT_ADDRESS   = "0xBBcAEC10D4AFa4E6Dd43359A23e568E3305209AF";   // replace with your deployed address
const BSCSCAN_TESTNET_URL      = "https://testnet.bscscan.com/tx/";

// ====== ABIs (simplified placeholders) ======
const AIRDROP_ABI = [{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"Blacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"by","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAssigned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"SnapshotTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"by","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxPerWallet","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"snapshots","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"takeSnapshot","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IULMD","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAirdrop","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const TOKEN_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"Blacklisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"field","type":"string"},{"indexed":false,"internalType":"string","name":"newValue","type":"string"}],"name":"MetadataUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"Whitelisted","type":"event"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"logoURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxWalletLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newLogoURI","type":"string"}],"name":"setLogoURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newName","type":"string"}],"name":"setName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newSymbol","type":"string"}],"name":"setSymbol","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newTelegram","type":"string"}],"name":"setTelegram","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newTwitter","type":"string"}],"name":"setTwitter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newWebsite","type":"string"}],"name":"setWebsite","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"telegram","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"twitter","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"website","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];

// ====== GLOBAL STATE ======
let provider, signer, userAddress;
let airdrop, token;

// ====== DOM ELEMENTS ======
const networkNameElem     = document.getElementById("networkName");
const statusDotElem       = document.getElementById("statusDot");
const connectWalletBtn    = document.getElementById("connectWallet");
const walletAddressElem   = document.getElementById("walletAddress");
const tokenBalanceElem    = document.getElementById("tokenBalance");
const snapshotBalanceElem = document.getElementById("snapshotBalance");
const eligibilityElem     = document.getElementById("eligibilityStatus");
const takeSnapshotBtn     = document.getElementById("takeSnapshot");
const claimableAmountElem = document.getElementById("claimableAmount");
const claimButtonElem     = document.getElementById("claimButton");
const statusElem          = document.getElementById("status");
const currentTimeElem     = document.getElementById("currentTime");

// ====== INIT ======
window.addEventListener("DOMContentLoaded", () => {
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  connectWalletBtn.addEventListener("click", connectWallet);
  if (takeSnapshotBtn) takeSnapshotBtn.addEventListener("click", handleTakeSnapshot);
  if (claimButtonElem) claimButtonElem.addEventListener("click", handleClaimAirdrop);

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => location.reload(), 200);
    });
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => location.reload());
    window.ethereum.on("chainChanged", () => location.reload());
  }
});

// ====== WALLET CONNECTION ======
async function connectWallet() {
  if (!window.ethereum) {
    updateStatus("MetaMask not detected.", "error");
    return;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    const network = await provider.getNetwork();
    if (network.chainId !== 97) {
      // If not on BSC Testnet, prompt switch
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }], // 97 in hex
        });
        location.reload();
        return;
      } catch (switchError) {
        updateStatus("Please switch to BSC Testnet (ChainID 97).", "error");
        return;
      }
    }

    // Hide "Not Connected" and show short address
    walletAddressElem.textContent = shortenAddress(userAddress);
    networkNameElem.textContent = "BSC Testnet";
    connectWalletBtn.disabled = true;
    connectWalletBtn.textContent = "Connected";
    statusDotElem.classList.add("connected");

    airdrop = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, signer);
    token   = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, provider);

    await updateWalletInfo();
  } catch (err) {
    updateStatus("Wallet connection failed.", "error");
    console.error(err);
  }
}

// ====== WALLET INFO ======
async function updateWalletInfo() {
  if (!provider || !signer || !userAddress) return;

  try {
    const [rawBalance, decimals, rawSnapshotBalance] = await Promise.all([
      token.balanceOf(userAddress),
      token.decimals(),
      airdrop.snapshotBalances(userAddress)
    ]);

    const balance = ethers.utils.formatUnits(rawBalance, decimals);
    tokenBalanceElem.textContent = parseFloat(balance).toLocaleString();

    const snapshotBalance = ethers.utils.formatUnits(rawSnapshotBalance, decimals);
    snapshotBalanceElem.textContent = parseFloat(snapshotBalance).toLocaleString();

    const eligibilityStatus = parseFloat(balance) >= 200000;
    if (rawSnapshotBalance.gt(0)) {
      eligibilityElem.textContent = "Verified";
      takeSnapshotBtn.disabled = true;
      takeSnapshotBtn.textContent = "Snapshot Taken";
    } else if (eligibilityStatus) {
      eligibilityElem.textContent = "Eligible - Not Verified";
      takeSnapshotBtn.disabled = false;
      takeSnapshotBtn.textContent = "Take Snapshot (Verify)";
    } else {
      eligibilityElem.textContent = "Not Eligible";
      takeSnapshotBtn.disabled = true;
    }

    const rawClaimable = await airdrop.getClaimableAmount(userAddress);
    const claimable = ethers.utils.formatUnits(rawClaimable, decimals);
    claimableAmountElem.textContent = parseFloat(claimable).toLocaleString();

    const hasClaimed = await airdrop.hasClaimed(userAddress);
    const paused = await airdrop.paused();

    if (hasClaimed) {
      claimButtonElem.disabled = true;
      claimButtonElem.textContent = "Already Claimed";
    } else if (paused) {
      claimButtonElem.disabled = true;
      claimButtonElem.textContent = "Claiming Paused";
    } else if (!eligibilityStatus || rawSnapshotBalance.eq(0)) {
      claimButtonElem.disabled = true;
      claimButtonElem.textContent = "Not Eligible";
    } else if (rawClaimable.eq(0)) {
      claimButtonElem.disabled = true;
      claimButtonElem.textContent = "No Airdrop";
    } else {
      claimButtonElem.disabled = false;
      claimButtonElem.textContent = "Claim Airdrop";
    }
  } catch (err) {
    tokenBalanceElem.textContent = "0";
    snapshotBalanceElem.textContent = "0";
    updateStatus("Failed to update wallet info.", "error");
    console.error(err);
  }
}

// ====== SNAPSHOT ======
async function handleTakeSnapshot() {
  try {
    const rawSnapshotBalance = await airdrop.snapshotBalances(userAddress);
    if (rawSnapshotBalance.gt(0)) {
      updateStatus("Already verified.", "error");
      return;
    }

    takeSnapshotBtn.disabled = true;
    updateStatus("Taking snapshot...", "success");

    const tx = await airdrop.takeSnapshot(userAddress);
    const receipt = await tx.wait();

    updateStatus(
      `Snapshot taken! <a href="${BSCSCAN_TESTNET_URL}${receipt.transactionHash}" target="_blank">View</a>`,
      "success"
    );
    await updateWalletInfo();
  } catch (err) {
    updateStatus("Snapshot failed.", "error");
    console.error(err);
    takeSnapshotBtn.disabled = false;
  }
}

// ====== CLAIM ======
async function handleClaimAirdrop() {
  try {
    claimButtonElem.disabled = true;
    updateStatus("Processing claim...", "success");

    const tx = await airdrop.claim();
    const receipt = await tx.wait();

    updateStatus(
      `Airdrop claimed! <a href="${BSCSCAN_TESTNET_URL}${receipt.transactionHash}" target="_blank">View</a>`,
      "success"
    );
    await updateWalletInfo();
  } catch (err) {
    updateStatus("Claim failed.", "error");
    console.error(err);
    claimButtonElem.disabled = false;
  }
}

// ====== HELPERS ======
function shortenAddress(addr) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

function updateStatus(msg, type) {
  statusElem.innerHTML = msg;
  statusElem.className = "status";
  if (type === "success") statusElem.classList.add("success");
  if (type === "error") statusElem.classList.add("error");
}

function updateCurrentTime() {
  const now = new Date();
  const formatted = now.getUTCFullYear() + "-" +
    String(now.getUTCMonth() + 1).padStart(2, "0") + "-" +
    String(now.getUTCDate()).padStart(2, "0") + " " +
    String(now.getUTCHours()).padStart(2, "0") + ":" +
    String(now.getUTCMinutes()).padStart(2, "0") + ":" +
    String(now.getUTCSeconds()).padStart(2, "0");
  currentTimeElem.textContent = formatted;
}
