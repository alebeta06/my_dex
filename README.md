# 💧 DAG Yield Aggregator (MVP) — BlockDAG Testnet

Una aplicación DeFi que simula un agregador de rendimiento (Yield Aggregator) estilo Yearn. Construida con **Scaffold-ETH 2**, **Foundry**, y desplegada en la testnet **BlockDAG Primordial**.


## ⚙️ Funcionalidades

- ✅ Vault con lógica de depósito y retiro
- ✅ Estrategia externa para farming simulada
- ✅ Botón para aprobar tokens al Vault
- ✅ Función `harvest()` del owner para recolectar rendimientos
- ✅ Función `rebalance()` del Controller para migrar fondos
- ✅ Dashboard con estadísticas y dirección del contrato Strategy
- ✅ Simulación de APY basado en crecimiento de assets
- ✅ Botones protegidos para el owner
- ✅ Explorador de bloques y debug desde la UI

## 🧪 MVP Actual

Desde la vista principal (`Home`) puedes:

- Aprobar tokens al Vault
- Depositar tokens
- Retirar shares
- Ver dirección de la estrategia actual
- Ver APY estimado
- Ejecutar `harvest()` y `rebalance()` (solo owner)

## 🚀 Ejecutar la aplicación localmente

1. Clone el Repo

2. En la Terminal A, levanta la red local:

```
yarn chain
```
3. En un segundo terminal, implemente los contrato
```
yarn deploy
```

4. En la Terminal C, inicia el frontend:
```
yarn start
```
Accede a la app en: http://localhost:3000

🧪 Probar contratos con Foundry

cd packages/foundry
```
forge test
```
🧾 Estructura del Proyecto

```
packages/
├── foundry/             # Contratos Solidity, pruebas y despliegue
│   └── contracts/       # Vault, Controller, Strategy, MockERC20
│   └── script/          # Scripts de deploy y verificación
│   └── test/            # Pruebas con Forge
├── nextjs/              # Frontend con Next.js (Scaffold-ETH 2)
│   ├── app/             # Vista Home y Strategy
│   ├── components/      # Header, StrategyStats, etc.
│   ├── hooks/           # useScaffoldReadContract, etc.
│   └── utils/           # Configuración de redes, wagmi, etc.
```


## 🌐 Red y Explorador
Red: BlockDAG Primordial Testnet

Explorador: https://primordial.bdagscan.com

## 🛠 Posibilidades a futuro
- Integración con estrategias reales (como Aave o Compound)

- Permitir múltiples estrategias y cambiar entre ellas

- Estadísticas más detalladas (historial, gráficas)

- Alerta y monitoreo de harvest automático

- UI para usuarios y administradores separada

 - Seguridad: validaciones adicionales y timelocks


### 📄 Licencia
- MIT — libre uso para fines educativos o comerciales bajo atribución.

### ⚠️ Disclaimer: Este proyecto es un MVP de demostración en testnet, no debe usarse en producción sin auditoría.
