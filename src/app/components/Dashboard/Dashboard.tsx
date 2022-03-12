import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  parse,
  format,
  getDate,
  addMonths,
  subMonths,
  setDate,
  getDay,
  subWeeks,
  setDay,
  addWeeks
} from "date-fns";
import btcImg from "../../../assets/images/btc.png";
import { useStore } from "@bitcoin-dva/hooks";
import { Icon } from "@bitcoin-dva/components";
import globalStore, {
  flushStore,
  updateStore
} from "@bitcoin-dva/config/globalStore";
import { HistoryCard } from "./components/HistoryCard";
import * as S from "./styled";

type ConfirmationModalProps = {
  title: string;
  description: React.ReactElement | string;
  confirmButton: string;
  confirmFn: () => void;
};

const today = new Date();

export const Dashboard = () => {
  const {
    actualWalletInBTC,
    investDay,
    averageInvest,
    bitcoinGrowthPerYear,
    currency,
    mode,
    history,
    dcaCompareHistory
  } = useStore([
    "isConfigSet",
    "actualWalletInBTC",
    "investDay",
    "averageInvest",
    "bitcoinGrowthPerYear",
    "currency",
    "mode",
    "history",
    "dcaCompareHistory"
  ]);
  const [btcPriceLastInvestDay, setBtcPriceLastInvestDay] = useState(0);
  const [btcPriceNow, setBtcPriceNow] = useState(0);
  const [confirmationModal, setConfirmationModal] =
    useState<ConfirmationModalProps | null>(null);

  const lastInvestDay = useMemo(() => {
    if (mode === "monthly") {
      const todayDateOfTheMonth = getDate(today);
      if (todayDateOfTheMonth <= investDay) {
        return setDate(subMonths(today, 1), investDay);
      } else {
        return setDate(today, investDay);
      }
    } else {
      const todayWeekDay = getDay(today);
      if (todayWeekDay <= investDay) {
        return setDay(subWeeks(today, 1), investDay);
      } else {
        return setDay(today, investDay);
      }
    }
  }, [mode]);

  const addFunction = useMemo(
    () => (mode === "monthly" ? addMonths : addWeeks),
    [mode]
  );

  const isInvestDay = useMemo(() => {
    const haveInvestedToday = !!history.find(
      (historyPoint) => format(today, "dd-MM-yyyy") === historyPoint.date
    );
    if (haveInvestedToday) {
      return "already";
    }

    if (mode === "monthly") {
      const todayDateOfTheMonth = getDate(today);
      return todayDateOfTheMonth === investDay;
    } else {
      const todayDayOfTheWeek = getDay(today);
      return todayDayOfTheWeek === investDay;
    }
  }, [today, investDay, mode, history.length]);

  const getBtcPrice = useCallback(async () => {
    const {
      data: {
        market_data: {
          current_price: { [currency]: btcPriceLastInvestDay }
        }
      }
    } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${format(
        lastInvestDay,
        "dd-MM-yyyy"
      )}`
    );

    let priceNow;

    if (!isInvestDay) {
      const {
        data: {
          bitcoin: { [currency]: _priceNow }
        }
      } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
      );
      priceNow = _priceNow;
    } else {
      const {
        data: {
          market_data: {
            current_price: { [currency]: _priceNow }
          }
        }
      } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${format(
          addFunction(lastInvestDay, 1),
          "dd-MM-yyyy"
        )}`
      );
      priceNow = _priceNow;
    }

    setBtcPriceLastInvestDay(Math.round(btcPriceLastInvestDay));
    setBtcPriceNow(Math.round(priceNow));
  }, [lastInvestDay, isInvestDay, mode, addFunction]);

  useEffect(() => {
    getBtcPrice();
  }, [getBtcPrice]);

  const expectedGrowth = useMemo(
    () => bitcoinGrowthPerYear / 100 / (mode === "monthly" ? 12 : 52.1786),
    [mode]
  );
  const realGrowth = useMemo(
    () => btcPriceNow / btcPriceLastInvestDay - 1,
    [btcPriceLastInvestDay, btcPriceNow]
  );

  const wallet = useMemo(() => {
    return {
      lastInvestDay: {
        btc: actualWalletInBTC,
        currency: Math.round(actualWalletInBTC * btcPriceLastInvestDay)
      },
      actual: {
        btc: actualWalletInBTC,
        currency: Math.round(actualWalletInBTC * btcPriceNow)
      },
      expectedNextInvestDay: {
        currency: Math.round(
          actualWalletInBTC * btcPriceLastInvestDay * (1 + expectedGrowth)
        )
      }
    };
  }, [btcPriceLastInvestDay, btcPriceNow, expectedGrowth]);

  const walletValueDifferenceWithToday = useMemo(
    () => wallet.lastInvestDay.currency - wallet.actual.currency,
    [wallet.lastInvestDay.currency, wallet.actual.currency]
  );

  const targetValue = useMemo(
    () => wallet.lastInvestDay.currency * (1 + expectedGrowth) + averageInvest,
    [wallet.lastInvestDay.currency, expectedGrowth, averageInvest]
  );

  const differenceBetweenTargetAndActual = useMemo(
    () => targetValue - wallet.actual.currency,
    [targetValue, wallet.actual.currency]
  );

  const walletValueDifferenceWithExpected = useMemo(
    () => wallet.actual.currency - wallet.expectedNextInvestDay.currency,
    [wallet.actual.currency, wallet.expectedNextInvestDay.currency]
  );

  const currencyUppercase = useMemo(() => currency.toUpperCase(), [currency]);

  const getBitcoinCurrencyText = useCallback(
    (btc: number, currencyPrice: number, textProps: object = {}) => (
      <S.SimpleText as="span" {...textProps}>
        <S.SimpleText as="span" weight={600} {...textProps}>
          {btc.toFixed(8).replace(/\.?0+$/, "")} BTC
        </S.SimpleText>{" "}
        ~ {Math.round(btc * currencyPrice)} {currencyUppercase}
      </S.SimpleText>
    ),
    []
  );

  const isPositive = useMemo(
    () => walletValueDifferenceWithToday < 0,
    [walletValueDifferenceWithToday]
  );

  return (
    <S.AppContainer>
      {false ? (
        <S.BitcoinDVATitle color="#a4b0be" weight={600}>
          bitcoin-dva.io
        </S.BitcoinDVATitle>
      ) : null}
      <S.CardsContainer>
        <S.AppSide>
          <S.AppSideCard>
            <S.WalletCardSide>
              <S.WalletSideTitle isCentered>
                Last {mode === "monthly" ? "month" : "week"}
              </S.WalletSideTitle>
              <S.WalletSideSubTitle>
                {format(lastInvestDay, "dd-MM-yyyy")}
              </S.WalletSideSubTitle>
              <S.WalletSideContent>
                <S.WalletSideContentLine>
                  {wallet.lastInvestDay.currency} {currencyUppercase}
                </S.WalletSideContentLine>
              </S.WalletSideContent>
            </S.WalletCardSide>
            <S.WalletCardSide>
              <S.WalletSideTitle isCentered>
                {true ? "Today" : "This month invest day"}
              </S.WalletSideTitle>
              <S.WalletSideSubTitle>
                {format(today, "dd-MM-yyyy")}
              </S.WalletSideSubTitle>
              <S.WalletSideContent>
                <S.WalletSideContentLine>
                  {wallet.actual.currency} {currencyUppercase}
                </S.WalletSideContentLine>
                <S.WalletSideContentLine
                  as="span"
                  isSubline
                  color={isPositive ? "#2ed573" : "#ff4757"}
                >
                  {isPositive ? "⬆️" : "⬇️"} {isPositive ? "+" : "-"}
                  {Math.abs(Math.round(walletValueDifferenceWithToday))}{" "}
                  {currencyUppercase} / {isPositive ? "+" : "-"}
                  {Math.abs(realGrowth * 100).toFixed(2)}%
                </S.WalletSideContentLine>
              </S.WalletSideContent>
            </S.WalletCardSide>
          </S.AppSideCard>
          <S.AppSideCard isColumn isSpecialBackground={isInvestDay === true}>
            <S.WalletSideTitle isWhite={isInvestDay === true}>
              Operation
            </S.WalletSideTitle>
            <S.OperationContentContainer>
              {isInvestDay === true ? (
                (() => {
                  const plannedInvest = averageInvest / btcPriceNow;
                  let action = "Buy";
                  let btcAmount = plannedInvest;

                  if (differenceBetweenTargetAndActual > 0) {
                    const finalInvest =
                      averageInvest - walletValueDifferenceWithExpected;
                    const btcToBuy = finalInvest / btcPriceNow;
                    action = "Buy";
                    btcAmount = btcToBuy;
                  } else if (differenceBetweenTargetAndActual < 0) {
                    const finalInvest = Math.abs(
                      differenceBetweenTargetAndActual
                    );
                    const btcToSell = finalInvest / btcPriceNow;
                    action = "Sell";
                    btcAmount = btcToSell;
                  }

                  return (
                    <>
                      <S.OperationTextLine1 h3 weight={600} isWhite>
                        Today is your invest day!
                      </S.OperationTextLine1>
                      <S.OperationTextLine2 h4 isWhite>
                        According to your DVA plan and the Bitcoin price change
                        since last month, you should
                      </S.OperationTextLine2>
                      <S.OperationActionLine>
                        <S.OperationTextLine3
                          h2
                          weight={600}
                          isWhite={isInvestDay}
                        >
                          {action}
                        </S.OperationTextLine3>
                        <S.OperationTextLine4 h4 isWhite>
                          an amount of
                        </S.OperationTextLine4>
                        <S.OperationTextLine3>
                          {getBitcoinCurrencyText(btcAmount, btcPriceNow, {
                            isWhite: true,
                            h2: true
                          })}
                        </S.OperationTextLine3>
                      </S.OperationActionLine>
                      <S.ValidateExplaination h5 isWhite>
                        After you have successfully did this action, click the
                        following button to record it
                      </S.ValidateExplaination>
                      <S.OperationValidate
                        onClick={() => {
                          const btcTotalAmount =
                            (history[history.length - 1]?.btcAmount || 0) +
                            btcAmount;
                          const totalInvested =
                            (history[history.length - 1]?.investedInCurrency ||
                              0) +
                            btcAmount * btcPriceNow;

                          const date = format(
                            history[history.length - 1]
                              ? addMonths(
                                  parse(
                                    history[history.length - 1].date,
                                    "dd-MM-yyyy",
                                    today
                                  ),
                                  1
                                )
                              : today,
                            "dd-MM-yyyy"
                          );

                          const dcaBtcAmount = Number.parseFloat(
                            (
                              (dcaCompareHistory[dcaCompareHistory.length - 1]
                                ?.btcAmount || 0) + btcAmount
                            )
                              .toFixed(8)
                              .replace(/\.?0+$/, "")
                          );

                          updateStore({
                            // TODO V2: When you effectively received your BTC, please write precisely how much you recevied and how much you paid, all including fees
                            history: [
                              ...history,
                              {
                                date,
                                investedInCurrency: totalInvested,
                                walletValueInCurrency:
                                  btcPriceNow * btcTotalAmount,
                                btcAmount: Number.parseFloat(
                                  btcTotalAmount
                                    .toFixed(8)
                                    .replace(/\.?0+$/, "")
                                )
                              }
                            ],
                            dcaCompareHistory: [
                              ...dcaCompareHistory,
                              {
                                date,
                                walletValueInCurrency:
                                  btcPriceNow * dcaBtcAmount,
                                investedInCurrency:
                                  (dcaCompareHistory[
                                    dcaCompareHistory.length - 1
                                  ]?.investedInCurrency || 0) + averageInvest,
                                btcAmount: dcaBtcAmount
                              }
                            ]
                          });
                        }}
                      >
                        Done
                      </S.OperationValidate>
                    </>
                  );
                })()
              ) : (
                <S.OperationNotTodayExplaination color="#a4b0be">
                  {isInvestDay === false
                    ? "Today is not your invest day :("
                    : "You have already invested today!"}
                  <br />
                  Come back on{" "}
                  <S.OperationNotTodayExplaination
                    color="#a4b0be"
                    as="span"
                    weight={600}
                  >
                    {format(
                      addFunction(lastInvestDay, isInvestDay === false ? 1 : 2),
                      "dd-MM-yyyy"
                    )}
                  </S.OperationNotTodayExplaination>{" "}
                  to continue your DVA plan
                </S.OperationNotTodayExplaination>
              )}
            </S.OperationContentContainer>
          </S.AppSideCard>
        </S.AppSide>
        <S.AppSide>
          <HistoryCard />
          <S.ConfigCard isColumn>
            <S.ConfigSideTitle>Config</S.ConfigSideTitle>
            <S.ConfigContent>
              <S.ConfigButton
                onClick={async () => {
                  const { isAppLoaded, isConfigSet, ...rest } =
                    globalStore.store;
                  const fileName = `bitcoin-dva-config-${format(
                    today,
                    "dd-MM-yyyy"
                  )}`;
                  const json = JSON.stringify(rest);
                  const blob = new Blob([json], { type: "application/json" });
                  const href = await URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = href;
                  link.download = fileName + ".json";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Icon icon="file-export" size="lg" color="#2f3542" />
                <S.ConfigText>Export</S.ConfigText>
              </S.ConfigButton>
              <S.ConfigButton
                onClick={() => {
                  setConfirmationModal({
                    title: "Delete config",
                    description: (
                      <>
                        Are you sure you want to delete your config from your
                        local cache?
                        <br />
                        We suggest that you export it first, as a copy, before
                        you delete it.
                      </>
                    ),
                    confirmButton: "Delete",
                    confirmFn: () => {
                      flushStore({ isAppLoaded: true });
                    }
                  });
                }}
              >
                <Icon icon="trash" size="lg" color="#2f3542" />
                <S.ConfigText>Delete</S.ConfigText>
              </S.ConfigButton>
            </S.ConfigContent>
          </S.ConfigCard>
        </S.AppSide>
      </S.CardsContainer>
      <S.BtcPriceView h5>
        <S.BtcImg src={btcImg} />
        {btcPriceNow} {currencyUppercase}
      </S.BtcPriceView>
      {process.env.NODE_ENV === "development" ? (
        <S.ResetConfigButton
          onClick={() => {
            flushStore({ isAppLoaded: true });
          }}
        >
          Reset config
        </S.ResetConfigButton>
      ) : null}
      {confirmationModal ? (
        <S.ConfirmationModal
          {...confirmationModal}
          overlay={{ width: 600 }}
          onClose={() => {
            setConfirmationModal(null);
          }}
        >
          salut
        </S.ConfirmationModal>
      ) : null}
      <S.SupportMessage h5 color="#a4b0be">
        Buy KYC-free BTC on{" "}
        <a
          style={{ textDecoration: "none", color: "#2f3542" }}
          href="https://relai.app/download"
        >
          Relai
        </a>{" "}
        using the referal code: REL16727
      </S.SupportMessage>
      <S.SupportMessage h5 color="#a4b0be">
        Support: bc1q9tjhqunyvcskd8pmmp890fgmzd8xc25puegd0z
      </S.SupportMessage>
    </S.AppContainer>
  );
};
