import _ from "lodash";
import { createStore } from "fluxible-js";
import localforage from "localforage";
import { DeepPartial } from "./DeepPartial";

export type HistoryPoint = {
  date: string;
  investedInCurrency: number;
  walletValueInCurrency: number;
  btcAmount: number;
};

export type StoreType = {
  isAppLoaded: boolean;
  isConfigSet: boolean;
  actualWalletInBTC: number;
  investDay: number;
  averageInvest: number;
  bitcoinGrowthPerYear: number;
  currency: "eur" | "usd" | "chf";
  mode: "monthly" | "weekly";
  history: HistoryPoint[];
  dcaCompareHistory: HistoryPoint[];
  version: string;
};

export const initialStore: StoreType = {
  isAppLoaded: false,
  isConfigSet: false,
  actualWalletInBTC: 0,
  investDay: 1,
  averageInvest: 100,
  bitcoinGrowthPerYear: 100,
  currency: "eur",
  mode: "monthly",
  history: [],
  dcaCompareHistory: [],
  version: "0.0.1"
};

const globalStore = createStore(
  {
    initialStore,
    persist: {
      // @ts-ignore
      asyncStorage: localforage,
      restore: (savedStore) => ({ ...savedStore, isAppLoaded: false })
    }
  },
  () => {
    globalStore.updateStore({ isAppLoaded: true });
  }
);

export default globalStore;

export const omitStorePath = (omitPath: string) => {
  globalStore.updateStore(_.omit({ ...globalStore.store }, omitPath));
};

export const setStorePath = (path: string, value: any = {}) => {
  globalStore.updateStore(_.set({ ...globalStore.store }, path, value));
};

export const updateStore = (obj: DeepPartial<StoreType>) => {
  globalStore.updateStore(_.merge(globalStore.store, obj));
};

export const flushStore = (obj: DeepPartial<StoreType> = {}) => {
  globalStore.updateStore(_.merge(initialStore, obj));
};
