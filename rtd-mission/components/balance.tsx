"use client";

import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export default function Balance() {
  const { address, getRestEndpoint, getStargateClient } =
    useChain("cosmoshubtestnet");

  const [restBalances, setRestBalances] = useState<any>();
  const [cosmjsBalances, setCosmjsBalances] = useState<any>();

  useEffect(() => {
    if (!address) {
      return;
    }

    const fetchRestBalance = async () => {
      const balances = await fetch(
        `${await getRestEndpoint()}/cosmos/bank/v1beta1/balances/${address}`
      );
      const result = await balances.json();
      setRestBalances(result.balances);
    };
    fetchRestBalance();

    const fetchCosmjsBalance = async () => {
      const client = await getStargateClient();
      const result = await client.getAllBalances(address);
      setCosmjsBalances(result);
    };
    fetchCosmjsBalance();
  }, [address]);

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold">Balance</h3>
      <h4>from LCD(REST API)</h4>
      {restBalances &&
        restBalances.map((balance: any) => (
          <Badge
            variant="secondary"
            className="text-md font-normal mr-3"
            key={balance.denom}
          >
            {balance.amount}
            {balance.denom}
          </Badge>
        ))}
      <h4 className="pt-2">from CosmJS</h4>
      {cosmjsBalances &&
        cosmjsBalances.map((balance: any) => (
          <Badge
            variant="secondary"
            className="text-md font-normal  mr-3"
            key={balance.denom}
          >
            {balance.amount} {balance.denom}
          </Badge>
        ))}
    </div>
  );
}
