// ====== CONFIGURATION ======
const AIRDROP_CONTRACT_ADDRESS = "0xYourAirdropContract";
const TOKEN_CONTRACT_ADDRESS   = "0xYourTokenContract";
const LEDGER_EXPLORER_URL      = "https://scan.mypinata.cloud/ipfs/bafybeih3olry3is4e4lzm7rus5l3h6zrphcal5a7ayfkhzm5oivjro2cp4/#//tx/";

// ====== ABIs (simplified placeholders) ======
const AIRDROP_ABI = [];

const TOKEN_ABI = [];

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

    // Hide "Not Connected" and show short address
    walletAddressElem.textContent = shortenAddress(userAddress);
    networkNameElem.textContent = "";
    connectWalletBtn.disabled = true;
    connectWalletBtn.textContent = "Connected";
    statusDotElem.classList.add("connected");

    airdrop = new ethers.Contract(AIRDROP_CONTRACT_ADDRESS, AIRDROP_ABI, signer);
    token   = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, provider);

    const network = await provider.getNetwork();
    networkNameElem.textContent = network.chainId === 369 ? "Pulse Chain" : "Unknown Network";

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

    updateStatus(`Snapshot taken! <a href="${LEDGER_EXPLORER_URL}${receipt.transactionHash}" target="_blank">View</a>`, "success");
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

    updateStatus(`Airdrop claimed! <a href="${LEDGER_EXPLORER_URL}${receipt.transactionHash}" target="_blank">View</a>`, "success");
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
