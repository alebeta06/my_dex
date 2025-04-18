"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export default function StrategyPage() {
  const { address: userAddress } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Read Vault contract state
  const userAddr = userAddress || ZERO_ADDRESS;
  const { data: userShares } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "balanceOf",
    args: [userAddr],
  });
  const { data: totalAssets } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalAssets",
  });
  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "totalSupply",
  });

  // Prepare write functions for Vault and Controller contracts
  const { writeContractAsync: writeVault } = useScaffoldWriteContract({ contractName: "Vault" });
  const { writeContractAsync: writeController } = useScaffoldWriteContract({ contractName: "Controller" });

  // Format BigInt values to human-readable strings
  const userSharesFormatted = formatEther(userShares ?? 0n);
  const totalAssetsFormatted = formatEther(totalAssets ?? 0n);
  const totalSupplyFormatted = formatEther(totalSupply ?? 0n);

  return (
    <>
      {!userAddress && (
        <div className="flex justify-center p-3">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Vault Dashboard</h2>
              <p>No wallet connected.</p>
            </div>
          </div>
        </div>
      )}
      {userAddress && (
        <div className="flex justify-center p-3">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Vault Dashboard</h2>
              <p>Tu Balance: {userSharesFormatted} shares</p>
              <p>Activos Totales: {totalAssetsFormatted} tokens</p>
              <p>Supply Total: {totalSupplyFormatted} shares</p>

              {/* Depositar section */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Depositar</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Cantidad"
                    className="input input-bordered w-full"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      if (!depositAmount) return;
                      try {
                        await writeVault({
                          functionName: "deposit",
                          args: [parseEther(depositAmount)],
                        });
                      } catch (err) {
                        console.error("Error al depositar:", err);
                      }
                    }}
                  >
                    Depositar
                  </button>
                </div>
              </div>

              {/* Retirar section */}
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Retirar</span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Cantidad de shares"
                    className="input input-bordered w-full"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      if (!withdrawAmount) return;
                      try {
                        await writeVault({
                          functionName: "withdraw",
                          args: [parseEther(withdrawAmount)],
                        });
                      } catch (err) {
                        console.error("Error al retirar:", err);
                      }
                    }}
                  >
                    Retirar
                  </button>
                </div>
              </div>

              {/* Strategy actions: Harvest and Rebalance */}
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    try {
                      await writeVault({ functionName: "harvest" });
                    } catch (err) {
                      console.error("Error al hacer harvest:", err);
                    }
                  }}
                >
                  Harvest
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    try {
                      await writeController({ functionName: "rebalance" });
                    } catch (err) {
                      console.error("Error al hacer rebalance:", err);
                    }
                  }}
                >
                  Rebalance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
