"use client";

import { useChain } from "@cosmos-kit/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Send() {
  const { address, getSigningStargateClient } = useChain("cosmoshubtestnet");
  const [receiver, setReceiver] = useState("");
  const [balance, setBalance] = useState("");

  const send = async () => {
    if (!address) {
      return;
    }

    const client = await getSigningStargateClient();
    try {
      const res = await client.sendTokens(
        address,
        receiver,
        [{ amount: balance, denom: "uatom" }],
        "auto"
      );
      console.log(res);
      window.open(
        `https://mintscan.io/cosmoshub-testnet/address/${res.transactionHash}`,
        "_blank"
      );
    } catch (e) {
      window.open(
        `https://mintscan.io/cosmoshub-testnet/address/${address}`,
        "_blank"
      );
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold">Send</h3>
      <Input
        type="text"
        placeholder="Receiver address"
        value={receiver}
        className="max-w-md"
        onChange={(e) => setReceiver(e.target.value)}
      />
      <Input
        type="text"
        value={balance}
        placeholder="Amount"
        className="max-w-md"
        onChange={(e) => setBalance(e.target.value)}
      />
      <Button onClick={send}>Send</Button>
    </div>
  );
}
