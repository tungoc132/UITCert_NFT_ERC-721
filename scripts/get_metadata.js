const { Network, Alchemy } = require('alchemy-sdk');

// Cấu hình Alchemy SDK
const settings = {
  apiKey: 'hTj3Cb2RTRO_Qr2xEKPeXSpP_zUjbmP0', // Đổi API Key
  network: Network.ETH_SEPOLIA, // Đổi network tương ứng
};
const alchemy = new Alchemy(settings);

async function getNFTMetadata(nftContractAddress, tokenId) {
  const response = await alchemy.nft.getNftMetadata(
    nftContractAddress,
    tokenId
  );
  return response;
}

async function main() {
  try {
    const response = await getNFTMetadata(
      '0x183Bc84F4DfEA4e298BB9F11a363ea44fB257F35', // Thay bằng địa chỉ contract NFT
      '1' // Thay bằng tokenId tương ứng
    );
    console.log('NFT Metadata:\n', response.raw);
  } catch (error) {
    console.log(error);
  }
}

main();
