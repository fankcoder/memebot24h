require('dotenv').config();
const { ethers } = require('ethers');

// 从环境变量中加载私钥和RPC URL
const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

// 创建一个Provider和Signer实例
const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// PancakeSwap V3 Router合约地址和ABI
const routerAddress = process.env.PANCAKE_SWAP_V3_ROUTER;
const routerABI = [
  // 路由器合约的ABI部分（示例）
  "function exactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint256 amountOutMinimum, address recipient, uint256 deadline) external returns (uint256 amountOut)"
];

// 初始化合约实例
const routerContract = new ethers.Contract(routerAddress, routerABI, wallet);

// 设置交易参数
const tokenInAddress = "输入代币地址"; // 比如 WBNB 地址
const tokenOutAddress = "输出代币地址"; // 比如 USDT 地址
const fee = 3000; // 选择流动性池的费用级别（例如 0.3%）
const amountIn = ethers.utils.parseUnits("1.0", 18); // 1 个 WBNB
const amountOutMinimum = ethers.utils.parseUnits("0.8", 18); // 最小接收量
const recipient = wallet.address; // 收款地址
const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 交易期限为20分钟

async function executeTrade() {
  try {
    console.log("开始交易...");

    // 执行交易
    const tx = await routerContract.exactInputSingle(
      tokenInAddress,
      tokenOutAddress,
      fee,
      amountIn,
      amountOutMinimum,
      recipient,
      deadline
    );

    console.log("交易已发送:", tx.hash);

    // 等待交易确认
    const receipt = await tx.wait();
    console.log("交易已确认:", receipt);
  } catch (error) {
    console.error("交易失败:", error);
  }
}

// 执行交易
executeTrade();
