"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import StrategyStats from "~~/components/StrategyStats";
import { InputBase } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const VaultPage: NextPage = () => {
  const { address } = useAccount();
  const [depositAmt, setDepositAmt] = useState<string>("");
  const [withdrawShares, setWithdrawShares] = useState<string>("");

  // Leer valores del contrato Vault
  const { data: vaultBalance } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "balanceOf",
    args: [address || ""],
  });

  const { data: vaultAssets } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalAssets",
  });

  const { data: vaultSupply } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalSupply",
  });

  const { data: vaultOwner } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "owner",
  });

  const isVaultOwner = address?.toLowerCase() === vaultOwner?.toLowerCase();

  // Funciones para interactuar con Vault y Controller
  const vaultWrite = useScaffoldWriteContract({ contractName: "Vault" });
  const controllerWrite = useScaffoldWriteContract({ contractName: "Controller" });

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Vault Dashboard</h1>

      {/* Estadísticas principales del vault */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-4">
          <h2 className="font-semibold">Tu Balance</h2>
          <p>{vaultBalance ? formatEther(vaultBalance) : "0"} shares</p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Activos Totales</h2>
          <p>{vaultAssets ? formatEther(vaultAssets) : "0"} tokens</p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Supply de Shares</h2>
          <p>{vaultSupply ? formatEther(vaultSupply) : "0"} shares</p>
        </div>
      </div>

      {/* Formulario de Depósito */}
      <section className="mb-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Depositar</h2>
        <InputBase placeholder="Cantidad en ETH" value={depositAmt} onChange={setDepositAmt} />
        <button
          className="btn btn-primary mt-2"
          disabled={!depositAmt || vaultWrite.isPending}
          onClick={async () => {
            try {
              await vaultWrite.writeContractAsync({
                functionName: "deposit",
                args: [parseEther(depositAmt)],
              });
              setDepositAmt("");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          {vaultWrite.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Depositar"}
        </button>
      </section>

      {/* Formulario de Retiro */}
      <section className="mb-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Retirar</h2>
        <InputBase placeholder="Cantidad de shares" value={withdrawShares} onChange={setWithdrawShares} />
        <button
          className="btn btn-secondary mt-2"
          disabled={!withdrawShares || vaultWrite.isPending}
          onClick={async () => {
            try {
              await vaultWrite.writeContractAsync({
                functionName: "withdraw",
                args: [parseEther(withdrawShares)],
              });
              setWithdrawShares("");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          {vaultWrite.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Retirar"}
        </button>
      </section>

      {/* Funciones del Owner */}
      <div className="flex gap-4 mt-4">
        <button
          className="btn btn-accent"
          disabled={!isVaultOwner || vaultWrite.isPending}
          onClick={() => vaultWrite.writeContractAsync({ functionName: "harvest", args: undefined })}
        >
          {vaultWrite.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Harvest"}
        </button>

        <button
          className="btn btn-accent"
          disabled={!isVaultOwner || controllerWrite.isPending}
          onClick={() => controllerWrite.writeContractAsync({ functionName: "rebalance", args: undefined })}
        >
          {controllerWrite.isPending ? <span className="loading loading-spinner loading-sm"></span> : "Rebalance"}
        </button>
      </div>

      {/* 🧠 Componente de estadísticas de la estrategia */}
      <StrategyStats />
    </div>
  );
};

export default VaultPage;
