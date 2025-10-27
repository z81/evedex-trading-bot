# Evedex Trading Bot

A minimal trading bot built with Bun that showcases the [Evedex Exchange Bot SDK](https://docs.evedex.com/developers/exchange_bot_sdk). The script connects to the demo derivatives environment, opens a leveraged long market order for 100 USD notional (x100 leverage), waits for execution, and then sends the opposite order to close the position.

## Prerequisites

- [Bun](https://bun.sh/) `>= 1.1`
- Account on [demo-exchange.evedex.com](https://demo-exchange.evedex.com)
- Wallet private key (and optionally an API token tied to the same account)

## Installation

```bash
bun install
```

## Configuration

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Provide the required secrets:
   - `PRIVATE_KEY` – wallet private key with demo funds
   - `API_TOKEN` – optional API token used for account lookups

## Running the bot

```bash
PRIVATE_KEY=0x... bun run src/bot.ts
```

Or, once `.env` is populated:

```bash
bun run src/bot.ts
```

## How it works

1. Creates a `DemoContainer` with the `ws` WebSocket client.
2. Uses the trade config from `src/bot.ts` (`TRADE_CONFIG`) to compute the notional amount.
3. Places a long market order with the specified leverage.
4. Waits briefly, then issues the opposite market order to flatten the position.
5. Closes the WebSocket connection and exits.

## Customization

- Update `TRADE_CONFIG` in `src/bot.ts` to change the instrument, leverage, or USD amount.
- Replace `DemoContainer` with `ProdContainer` when targeting the production exchange, and ensure order parameters match the requirements of your instrument.

## Useful links

- SDK documentation: https://docs.evedex.com/developers/exchange_bot_sdk
- Toolkit overview: https://docs.evedex.com/developers/toolkit
