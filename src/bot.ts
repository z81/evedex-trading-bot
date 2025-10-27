import * as evedexSdk from "@evedex/exchange-bot-sdk";
import { WebSocket } from "ws";

const TRADE_CONFIG = {
  instrument: "BTCUSD:DEV",
  leverage: 100,
  amountUsd: 100,
} as const;

async function main() {
  const container = new evedexSdk.DemoContainer({
    centrifugeWebSocket: WebSocket,
    wallets: {
      baseAccount: {
        privateKey: Bun.env.PRIVATE_KEY!,
      },
    },
    apiKeys: {
      default: {
        apiKey: Bun.env.API_TOKEN ?? "",
      },
    },
  });

  const account = await container.account("baseAccount");

  const { instrument, leverage, amountUsd } = TRADE_CONFIG;
  const notionalUsd = amountUsd * leverage;

  console.info(`Opening long market order on ${instrument}`);
  console.info(`→ amount: ${amountUsd} USD, leverage: x${leverage}, notional: ${notionalUsd} USD`);

  const buyOrderResult = await account.createMarketOrderV2({
    instrument,
    side: evedexSdk.Side.Buy, // use literal side values as defined by the SDK enum
    cashQuantity: notionalUsd, // SDK expects quantity scaled by 1e8 and stringified
    leverage,
    timeInForce: evedexSdk.TimeInForce.IOC,
  });

  console.info("Buy order result:", buyOrderResult);

  await waitFor(1_000);

  console.info(`Closing position with immediate market sell on ${instrument}`);

  const sellOrderResult = await account.createMarketOrderV2({
    instrument,
    side: evedexSdk.Side.Sell,
    cashQuantity: notionalUsd,
    leverage,
    timeInForce: evedexSdk.TimeInForce.IOC,
  });

  console.info("Sell order result:", sellOrderResult);

  container.closeWsConnection();
}

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error("Bot execution failed");
  console.error(error);
  process.exitCode = 1;
});
