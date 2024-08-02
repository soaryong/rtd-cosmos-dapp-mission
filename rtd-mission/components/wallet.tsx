"use client";

import { useChain } from "@cosmos-kit/react";
import { Button } from "./ui/button";

export default function Wallet() {
  const { chain, status, address, openView } = useChain("cosmoshub");
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">Wallet</h3>
      <Button onClick={openView}>
        {status === "Connected" ? (
          <>
            {address} ({chain.chain_name})
          </>
        ) : (
          <>Connect Wallet</>
        )}
      </Button>
    </div>
  );
}
