import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StyledComponentPropsWithRef } from "styled-components";
import { useStore } from "@bitcoin-dva/hooks";
import {
  getUnixTime,
  parse,
  getDayOfYear,
  lastDayOfYear as getLastDayOfYear,
  addMonths,
  addWeeks,
  isSameYear,
  format,
  isPast
} from "date-fns";
import {
  HistoryPoint,
  setStorePath,
  updateStore
} from "@bitcoin-dva/config/globalStore";
import { Text } from "@bitcoin-dva/components";
import * as S from "./styled";

const today = new Date();

type DemoModalProps = StyledComponentPropsWithRef<typeof S.DemoModalContainer>;

export const DemoModal = (props: DemoModalProps) => {
  const {
    currency,
    averageInvest,
    bitcoinGrowthPerYear,
    history,
    mode,
    investDay
  } = useStore([
    "currency",
    "averageInvest",
    "history",
    "bitcoinGrowthPerYear",
    "mode",
    "investDay"
  ]);
  const expectedGrowth = useMemo(
    () => bitcoinGrowthPerYear / 100 / (mode === "monthly" ? 12 : 52.1786),
    [mode]
  );
  const [year, setYear] = useState("2021");
  const [isLoading, setIsLoading] = useState(false);

  const buildHistory = useCallback(async () => {
    setIsLoading(true);
    const firstDayOfYear = parse(`01-01-${year}`, "dd-MM-yyyy", today);
    const lastDayOfYear = getLastDayOfYear(firstDayOfYear);
    const {
      data: { prices }
    }: { data: { prices: number[][] } } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=${currency}&from=${getUnixTime(
        firstDayOfYear
      )}&to=${getUnixTime(lastDayOfYear)}`
    );

    const dcaHistoryList: HistoryPoint[] = [];
    const dvaHistoryList: HistoryPoint[] = [];

    let currentDay = firstDayOfYear;
    const addFunction = mode === "monthly" ? addMonths : addWeeks;
    while (isSameYear(firstDayOfYear, currentDay) && isPast(currentDay)) {
      const dayOfYear = getDayOfYear(currentDay) - 1;
      const currentDayPrice = (prices[dayOfYear] ||
        prices[prices.length - 1])[1];

      const newBtcAmount =
        averageInvest / currentDayPrice +
        (dcaHistoryList[dcaHistoryList.length - 1]?.btcAmount || 0);
      dcaHistoryList.push({
        date: format(currentDay, "dd-MM-yyyy"),
        investedInCurrency:
          (dcaHistoryList[dcaHistoryList.length - 1]?.investedInCurrency || 0) +
          averageInvest,
        walletValueInCurrency: newBtcAmount * currentDayPrice,
        btcAmount: newBtcAmount
      });

      const lastDvaHistoryPoint =
        dayOfYear === 0 ? undefined : dvaHistoryList[dvaHistoryList.length - 1];

      const targetValue = lastDvaHistoryPoint
        ? lastDvaHistoryPoint.btcAmount *
            prices[
              getDayOfYear(
                parse(lastDvaHistoryPoint.date, "dd-MM-yyyy", today)
              ) - 1
            ][1] *
            (1 + expectedGrowth) +
          averageInvest
        : undefined;

      const differenceBetweenTargetAndActual =
        lastDvaHistoryPoint && targetValue
          ? targetValue - lastDvaHistoryPoint.btcAmount * currentDayPrice
          : 0;

      const plannedInvest = averageInvest / currentDayPrice;
      let action = "buy";
      let btcAmount = plannedInvest;

      if (differenceBetweenTargetAndActual > 0) {
        const finalInvest = differenceBetweenTargetAndActual;
        const btcToBuy = finalInvest / currentDayPrice;
        action = "buy";
        btcAmount = btcToBuy;
      } else if (differenceBetweenTargetAndActual < 0) {
        const finalInvest = Math.abs(differenceBetweenTargetAndActual);
        const btcToSell = finalInvest / currentDayPrice;
        action = "sell";
        btcAmount = btcToSell;
      }

      const newDvaBtcAmount =
        action === "buy"
          ? btcAmount +
            (dvaHistoryList[dvaHistoryList.length - 1]?.btcAmount || 0)
          : (dvaHistoryList[dvaHistoryList.length - 1]?.btcAmount || 0) -
            btcAmount;

      dvaHistoryList.push({
        date: format(currentDay, "dd-MM-yyyy"),
        walletValueInCurrency: newDvaBtcAmount * currentDayPrice,
        investedInCurrency:
          (dvaHistoryList[dvaHistoryList.length - 1]?.investedInCurrency || 0) +
          (action === "buy"
            ? currentDayPrice * btcAmount
            : 0 - currentDayPrice * btcAmount),
        btcAmount: newDvaBtcAmount
      });

      currentDay = addFunction(currentDay, 1);
    }

    setStorePath("history", dvaHistoryList);
    setStorePath("dcaCompareHistory", dcaHistoryList);

    setIsLoading(false);
  }, [currency, averageInvest, year, mode, investDay]);

  useEffect(() => {
    buildHistory();
  }, [buildHistory]);

  return (
    <S.DemoModalContainer {...props} overlay={{ width: 800, height: 800 }}>
      <S.Input
        name="Year"
        type="number"
        value={yearsList.find((yearItem) => yearItem.value === year)?.label}
        itemsList={yearsList}
        onChange={(e) => {
          setYear(e.target.value);
        }}
      />
      <S.Input
        name="Invest mode"
        value={
          investModeMap.find((investMode) => investMode.value === mode)
            ?.label || ""
        }
        itemsList={investModeMap}
        onChange={(e) => {
          updateStore({
            mode: e.target.value as any,
            investDay: 1
          });
        }}
      />
      {isLoading ? <Text>loading...</Text> : <S.HistoryCard hideTitle />}
    </S.DemoModalContainer>
  );
};

const yearsList = [
  { label: "2014", value: "2014" },
  { label: "2015", value: "2015" },
  { label: "2016", value: "2016" },
  { label: "2017", value: "2017" },
  { label: "2018", value: "2018" },
  { label: "2019", value: "2019" },
  { label: "2020", value: "2020" },
  { label: "2021", value: "2021" }
];

const investModeMap = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" }
];
