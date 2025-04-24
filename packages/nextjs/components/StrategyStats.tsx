"use client";

import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const StrategyStats = () => {
  // Leer dirección actual de la estrategia desde Vault
  const { data: strategyAddress } = useScaffoldReadContract({
    contractName: "Vault",
    functionName: "strategy",
  });

  // Leer el token want desde la estrategia
  const { data: wantAddress } = useScaffoldReadContract({
    contractName: "MockStrategy",
    functionName: "want",
  });

  // Leer el balance del token want dentro de la estrategia
  const { data: wantBalance } = useScaffoldReadContract({
    contractName: "MockERC20",
    functionName: "balanceOf",
    args: [strategyAddress || "0x0000000000000000000000000000000000000000"],
  });

  // Calcular APY simulado
  const apySimulado = 12.5; // Puedes reemplazar esto por una fórmula real si gustas

  return (
    <div className="card bg-base-100 shadow-lg p-4 mt-4">
      <h3 className="text-lg font-bold mb-2">📈 Estrategia actual</h3>
      <p>
        <strong>Dirección:</strong> {strategyAddress}
      </p>
      {wantAddress && (
        <p className="text-sm text-gray-500">
          Token <code>want</code> address: {wantAddress.toString()}
        </p>
      )}
      <p>
        <strong>Balance en estrategia:</strong> {wantBalance ? formatEther(wantBalance) : "0"} tokens
      </p>
      <p>
        <strong>APY simulado:</strong> {apySimulado}% anual
      </p>
    </div>
  );
};

export default StrategyStats;
