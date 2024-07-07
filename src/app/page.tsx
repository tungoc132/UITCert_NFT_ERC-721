'use client';

import "./design.css";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useState } from "react";
import { utils } from "ethers";

export default function Home() {
  const account = useActiveAccount();

  // Define the chain that is connected to
  const chain = defineChain( sepolia );
  const [quantity, setQuantity] = useState(1);

  // Define the address of the deployed contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: "0x183Bc84F4DfEA4e298BB9F11a363ea44fB257F35"
  });

  const {data: contractMetadata, isLoading: isContractMetadataLoading} = useReadContract(getContractMetadata, 
    { contract: contract }
  );

  const {data: claimedSupply, isLoading: isClaimedSupplyLoading} = useReadContract(getTotalClaimedSupply, 
    { contract: contract }
  );

  const {data: totalNFTSupply, isLoading: isTotalSupplyLoading} = useReadContract(nextTokenIdToMint, 
    { contract: contract }
  );

  const {data: claimCondition} = useReadContract(getActiveClaimCondition, 
    { contract: contract }
  );

  const getPrice = (quantity: number) => {
    const pricePerToken = claimCondition?.pricePerToken || 0n;
    const total = BigInt(quantity) * pricePerToken;
    return utils.formatEther(total);
  }

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20 text-center">
        <Header />
        <ConnectButton
          client={client}
          chain={chain}
        />

        <div className="flex flex-col py-5 items-center mt-4">
          {isContractMetadataLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <MediaRenderer
                client={client}
                src={contractMetadata?.image}
                className="border border-solid border-logo-300 rounded-xl"
              />
              <h2 className="text-2xl font-semibold mt-4">
                {contractMetadata?.name}
              </h2>
              <p className="text-lg mt-2 pb-10">
                {contractMetadata?.description}
              </p>
            </>
          )}

          {isClaimedSupplyLoading || isTotalSupplyLoading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-lg mt-2 font-semibold">
              Total NFT Supply: {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
            </p>
          )}

          <div className="flex flex-row items-center justify-center my-4">
            <button 
              className="text-xl text-white p-5 mr-4"
              onClick={() => setQuantity(Math.max(1, quantity-1))}
            >-</button>
            <input 
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 py-2 text-center border border-gray-300 rounded-md bg-black text-white" 
            />
            <button 
              className="text-xl text-white p-5 mr-4"
              onClick={() => setQuantity((quantity+1))}
            >+</button>
          </div>

          <TransactionButton
            transaction={() => claimTo({
              contract: contract,
              to: account?.address || "",
              quantity: BigInt(quantity),
            })}
            onTransactionConfirmed={async () => {
              alert("NFT Claimed!");
              setQuantity(1);
            }}
          >
            {`Claim NFT (${getPrice(quantity)} ETH)`}
          </TransactionButton>

        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center">
      <h1 className="text-3xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        UIT Graduation Certificate
      </h1>
      <h1 className="pb-10 text-3xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        NFT - ERC721
      </h1>
    </header>
  );
}