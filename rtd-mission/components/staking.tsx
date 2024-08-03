"use client";

import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import {
  MsgDelegateEncodeObject,
  MsgUndelegateEncodeObject,
  MsgWithdrawDelegatorRewardEncodeObject,
} from "@cosmjs/stargate";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function Staking() {
  const { address, getRestEndpoint, getSigningStargateClient } =
    useChain("cosmoshubtestnet");

  const [delegations, setDelegations] = useState<any>();
  const [rewards, setRewards] = useState<any>();
  const [amount, setAmount] = useState("");

  const delegate = async () => {
    if (!address) {
      return;
    }

    const msg: MsgDelegateEncodeObject = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: {
        delegatorAddress: address,
        validatorAddress:
          "cosmosvaloper1mngvkkhm6g7nqxh4hcv8hjxvgax4m8xujzt964",
        amount: { amount: amount, denom: "uatom" },
      },
    };
    const client = await getSigningStargateClient();
    const res = await client.signAndBroadcast(address, [msg], "auto");
    console.log(res);
  };

  const undelegate = async () => {
    if (!address) {
      return;
    }

    const msg: MsgUndelegateEncodeObject = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: {
        delegatorAddress: address,
        validatorAddress:
          "cosmosvaloper1mngvkkhm6g7nqxh4hcv8hjxvgax4m8xujzt964",
        amount: { amount: amount, denom: "uatom" },
      },
    };
    const client = await getSigningStargateClient();
    const res = await client.signAndBroadcast(address, [msg], "auto");
    console.log(res);
  };

  const claim = async () => {
    if (!address) {
      return;
    }

    const msg: MsgWithdrawDelegatorRewardEncodeObject = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: {
        delegatorAddress: address,
        validatorAddress:
          "cosmosvaloper1mngvkkhm6g7nqxh4hcv8hjxvgax4m8xujzt964",
      },
    };
    const client = await getSigningStargateClient();
    const res = await client.signAndBroadcast(address, [msg], "auto");
    console.log(res);
  };

  useEffect(() => {
    if (!address) {
      return;
    }

    const fetchDelegations = async () => {
      const balances = await fetch(
        `${await getRestEndpoint()}/cosmos/staking/v1beta1/delegations/${address}`
      );
      const result = await balances.json();
      setDelegations(result);
    };
    fetchDelegations();

    const fetchRewards = async () => {
      const reward = await fetch(
        `${await getRestEndpoint()}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
      );
      const result = await reward.json();
      setRewards(result);
    };
    fetchRewards();
  }, [address]);

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold">Staking</h3>
      <h4 className="text-md">Delegations</h4>
      {delegations &&
        delegations.delegation_responses &&
        delegations.delegation_responses.map((delegation: any) => (
          <Badge
            variant="secondary"
            className="text-md font-normal mr-3"
            key={delegation.delegation.validator_address}
          >
            [{delegation.delegation.validator_address}]{" "}
            {delegation.balance.amount}
            {delegation.balance.denom}
          </Badge>
        ))}
      <Input
        type="text"
        value={amount}
        placeholder="Amount"
        className="max-w-md"
        onChange={(e) => setAmount(e.target.value)}
      />
      <div className="space-x-2 flex">
        <Button onClick={delegate}>Delegate</Button>
        <Button onClick={undelegate}>Undelegate</Button>
      </div>
      <h4 className="text-md pt-2">Reward</h4>
      {rewards &&
        rewards.total &&
        rewards.total.map((reward: any) => (
          <Badge
            variant="secondary"
            className="text-md font-normal mr-3"
            key={reward.denom}
          >
            {reward.amount}
            {reward.denom}
          </Badge>
        ))}
      <Button onClick={claim}>Claim</Button>
    </div>
  );
}
