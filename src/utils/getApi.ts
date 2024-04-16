import { ApiPromise, WsProvider } from "@polkadot/api";

export async function getApi(url: string): Promise<ApiPromise> {
  return await ApiPromise.create({ provider: new WsProvider(url), noInitWarn: true });
}
