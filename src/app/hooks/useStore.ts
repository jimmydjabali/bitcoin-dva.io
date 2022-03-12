import { useCallback } from "react";
import globalStore, { StoreType } from "@bitcoin-dva/config/globalStore";
import { createFluxibleHook } from "react-fluxible";

type StoreKeys = keyof StoreType;
type UseStorePath = StoreKeys[];

const useGlobalStore = createFluxibleHook<StoreType>(globalStore);

export const useStore: <T extends UseStorePath>(
  storePaths: T
) => Pick<StoreType, T[number]> = (storePaths) => {
  const myStore = useGlobalStore(
    useCallback(
      (store) =>
        storePaths.reduce(
          (result, value) => ({
            ...result,
            [value]: store[value]
          }),
          {}
        ),
      [storePaths]
    )
  );
  return myStore as any;
};
