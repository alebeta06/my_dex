"use client";

import Link from "next/link";
import { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: addr } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const handleTransfer = async () => {
    if (!addr) return;
    try {
      await sendTransaction({
        to: addr,
        value: parseEther("0.001"),
      });
      alert("¡Transferencia enviada!");
    } catch {
      alert("Error al enviar.");
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 space-y-8">
      <h1 className="text-4xl font-bold text-center">Bienvenido a Mi DApp DeFi</h1>
      <div className="space-y-2 text-center">
        <p>Cuenta conectada:</p>
        <Address address={addr} />
      </div>
      <div className="space-x-4">
        <Link href="/vault">
          <button className="btn btn-primary">Ir al Vault</button>
        </Link>
        <button className="btn" onClick={handleTransfer}>
          Enviar 0.001 ETH
        </button>
      </div>
      <div className="flex gap-8 mt-12">
        <Link href="/debug" className="btn btn-outline">
          Debug Contracts
        </Link>
        <Link href="/blockexplorer" className="btn btn-outline">
          Block Explorer
        </Link>
      </div>
    </div>
  );
};

export default Home;
