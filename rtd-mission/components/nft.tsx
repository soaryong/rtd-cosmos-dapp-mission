"use client";

import { useChain } from "@cosmos-kit/react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function NFT() {
  const { address, getSigningCosmWasmClient } = useChain("neutrontestnet");
  const [contractAddress, setContractAddress] = useState(
    "neutron1g52kvc0y5s98q2walfwjtlk07h7mx8wnc4hsq0zrzelm0xlqezaqa40cec"
  );

  const initiate = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningCosmWasmClient();
    const init = await client.instantiate(
      address,
      5785,
      {
        name: "MY NFT",
        symbol: "MYNFT",
        minter: address,
      },
      "MY NFT TEST",
      "auto"
    );
    console.log(init);
    setContractAddress(init.contractAddress);
  };

  const mint = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningCosmWasmClient();
    const execute = await client.execute(
      address,
      contractAddress,
      { mint: { owner: address, token_id: "1" } },
      "auto"
    );
    console.log(execute);
  };
  
  const allTokens = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningCosmWasmClient();
    const query = await client.queryContractSmart(contractAddress, {
      all_tokens: { },
    });
    console.log(query);
  };
  
  const nftInfo = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningCosmWasmClient();
    const query = await client.queryContractSmart(contractAddress, {
      nft_info: { token_id: "1" },
    });
    console.log(query);
  };

  const transfer = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningCosmWasmClient();
    const execute = await client.execute(
      address,
      contractAddress,
      { transfer_nft: { recipient: address, token_id: "1" } },
      "auto"
    );
    console.log(execute);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold">CW721</h3>
      <div className="space-x-2 flex">
        <Button onClick={initiate}>Initiate</Button>
        <Button onClick={mint}>Mint</Button>
        <Button onClick={allTokens}>Query All Tokens</Button>
        <Button onClick={nftInfo}>Query NFT Info</Button>
        <Button onClick={transfer}>Transfer</Button>
      </div>
    </div>
  );
}
