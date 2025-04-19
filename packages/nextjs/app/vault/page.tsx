"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const VaultPage: NextPage = () => {
  const { address } = useAccount();

  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");

  // Lecturas del contrato Vault
  const { data: vaultBalance } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
  });

  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalAssets",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalSupply",
  });

  // Escribir en Vault y Controller
  const { writeContractAsync: writeVaultAsync, isPending: isVaultPending } = useScaffoldWriteContract({
    contractName: "Vault",
  });

  const { writeContractAsync: writeControllerAsync, isPending: isControllerPending } = useScaffoldWriteContract({
    contractName: "Controller",
  });

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Vault Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-4xl">
        <div className="card p-4 bg-base-200 shadow-md">
          <h2 className="font-semibold text-lg">Tu Balance</h2>
          <p>{vaultBalance ? formatEther(vaultBalance) : "0"} shares</p>
        </div>
        <div className="card p-4 bg-base-200 shadow-md">
          <h2 className="font-semibold text-lg">Activos Totales</h2>
          <p>{totalAssets ? formatEther(totalAssets) : "0"} tokens</p>
        </div>
        <div className="card p-4 bg-base-200 shadow-md">
          <h2 className="font-semibold text-lg">Supply Total</h2>
          <p>{totalSupply ? formatEther(totalSupply) : "0"} shares</p>
        </div>
      </div>

      {/* Depositar */}
      <section className="mb-10 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Depositar</h2>
        <InputBase value={depositAmount} onChange={setDepositAmount} placeholder="Cantidad a depositar" />
        <button
          className="btn btn-primary mt-2 w-full"
          disabled={!depositAmount || isVaultPending}
          onClick={async () => {
            try {
              await writeVaultAsync({
                functionName: "deposit",
                args: [parseEther(depositAmount)],
              });
              setDepositAmount("");
            } catch (err) {
              console.error("Error al depositar:", err);
            }
          }}
        >
          {isVaultPending ? "Procesando..." : "Depositar"}
        </button>
      </section>

      {/* Retirar */}
      <section className="mb-10 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Retirar</h2>
        <InputBase value={withdrawAmount} onChange={setWithdrawAmount} placeholder="Cantidad de shares" />
        <button
          className="btn btn-secondary mt-2 w-full"
          disabled={!withdrawAmount || isVaultPending}
          onClick={async () => {
            try {
              await writeVaultAsync({
                functionName: "withdraw",
                args: [parseEther(withdrawAmount)],
              });
              setWithdrawAmount("");
            } catch (err) {
              console.error("Error al retirar:", err);
            }
          }}
        >
          {isVaultPending ? "Procesando..." : "Retirar"}
        </button>
      </section>

      {/* Acciones del Owner */}
      <section className="flex gap-4 flex-wrap">
        <button
          className="btn btn-accent"
          disabled={isVaultPending}
          onClick={async () => {
            try {
              await writeVaultAsync({
                functionName: "harvest",
                args: [],
              });
            } catch (err) {
              console.error("Error al hacer harvest:", err);
            }
          }}
        >
          {isVaultPending ? "Harvesting..." : "Harvest"}
        </button>

        <button
          className="btn btn-accent"
          disabled={isControllerPending}
          onClick={async () => {
            try {
              await writeControllerAsync({
                functionName: "rebalance",
                args: [],
              });
            } catch (err) {
              console.error("Error al hacer rebalance:", err);
            }
          }}
        >
          {isControllerPending ? "Rebalancing..." : "Rebalance"}
        </button>
      </section>
    </div>
  );
};

export default VaultPage;
