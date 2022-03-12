import { useState } from "react";
import { useStore } from "@bitcoin-dva/hooks";
import { setStorePath, updateStore } from "@bitcoin-dva/config/globalStore";
import { Modal } from "@bitcoin-dva/components";
import { DemoModal } from "./components/DemoModal";
import * as S from "./styled";

const readFile = (file: any) =>
  new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = (x) => resolve(fr.result);
    fr.readAsText(file);
  });

export const SetupConfig = () => {
  const {
    currency,
    averageInvest,
    actualWalletInBTC,
    investDay,
    bitcoinGrowthPerYear,
    mode
  } = useStore([
    "currency",
    "averageInvest",
    "actualWalletInBTC",
    "investDay",
    "bitcoinGrowthPerYear",
    "mode"
  ]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isComparaisonModalOpen, setIsComparaisonModalOpen] = useState(false);

  return (
    <S.SetupConfigContainer>
      <S.WelcomeText h1 weight={600} color="white">
        bitcoin-dva.io
      </S.WelcomeText>
      <S.ShortExplainationText h4 weight={400} color="white">
        DVA (Dollar-Value-Average) can give you more return than basic DCA, by
        optimizing your investment,
        <br />
        based on the recent Bitcoin performance. This website helps you to setup
        a plan and take accurate decisions.
        <br />
        <br />
        <S.DCAComparaisonButton
          isReversed
          onClick={() => {
            setIsComparaisonModalOpen(true);
          }}
        >
          Comparaison with DCA
        </S.DCAComparaisonButton>
        <br />
        <br />
        Start by setting up your personnal configuration:
      </S.ShortExplainationText>
      <S.ConfigInputContainer>
        <S.CurrencyInput
          name="Currency"
          value={
            currencyItemsMap.find(
              (currencyItem) => currencyItem.value === currency
            )?.label
          }
          itemsList={currencyItemsMap}
          onChange={(e) => {
            updateStore({ currency: e.target.value as any });
          }}
        />
        <S.InputExplaination>
          The currency you want to use.
          <br />
          Available: USD, EUR, and CHF
        </S.InputExplaination>
      </S.ConfigInputContainer>
      <S.ConfigInputContainer>
        <S.CurrencyInput
          name="Average invest"
          type="number"
          value={averageInvest || ""}
          suffix={
            currencyItemsMap.find(
              (currencyItem) => currencyItem.value === currency
            )?.label
          }
          onChange={(e) => {
            updateStore({ averageInvest: Number.parseInt(e.target.value) });
          }}
        />
        <S.InputExplaination>
          How much, in{" "}
          {
            currencyItemsMap.find(
              (currencyItem) => currencyItem.value === currency
            )?.label
          }
          , you want to invest each month in average.
          <br />
          Note: We suggest that you add 10% of this amount as a reserve in{" "}
          {
            currencyItemsMap.find(
              (currencyItem) => currencyItem.value === currency
            )?.label
          }{" "}
          or Stablecoin
        </S.InputExplaination>
      </S.ConfigInputContainer>
      <S.ConfigInputContainer>
        <S.CurrencyInput
          name="Actual wallet in BTC"
          type="number"
          suffix="BTC"
          value={!Number.isNaN(actualWalletInBTC) ? actualWalletInBTC : ""}
          onChange={(e) => {
            updateStore({
              actualWalletInBTC: Number.parseFloat(e.target.value)
            });
          }}
        />
        <S.InputExplaination>
          How much BTC you actually have in your wallet
        </S.InputExplaination>
      </S.ConfigInputContainer>
      <S.ConfigInputContainer>
        <S.CurrencyInput
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
        <S.InputExplaination>
          Decide how frequent you want to invest
        </S.InputExplaination>
      </S.ConfigInputContainer>
      {mode === "monthly" ? (
        <S.ConfigInputContainer>
          <S.CurrencyInput
            name="Invest day"
            type="number"
            min="1"
            max="28"
            value={investDay || ""}
            onChange={(e) => {
              updateStore({
                investDay: Number.parseInt(e.target.value)
              });
            }}
          />
          <S.InputExplaination>
            Which day of each month you want to invest (ex. {investDay} of
            March, {investDay} of May, ...)
          </S.InputExplaination>
        </S.ConfigInputContainer>
      ) : (
        <S.ConfigInputContainer>
          <S.CurrencyInput
            name="Invest day"
            value={
              weeklyDayMap.find(
                (weekInvestDay) =>
                  Number.parseInt(weekInvestDay.value) === investDay
              )?.label || ""
            }
            itemsList={weeklyDayMap}
            onChange={(e) => {
              updateStore({
                investDay: Number.parseInt(e.target.value) as any
              });
            }}
          />
          <S.InputExplaination>
            Which day of each week you want to invest (ex. Monday, Tuesday,
            Friday, ...)
          </S.InputExplaination>
        </S.ConfigInputContainer>
      )}
      <S.AdvancedConfigurationButton
        isReversed
        onClick={() => {
          setIsAdvancedMode(!isAdvancedMode);
        }}
      >
        {isAdvancedMode ? "Hide advanced" : "Advanced"}
      </S.AdvancedConfigurationButton>
      <S.AdvancedModeContainer isOpen={isAdvancedMode}>
        <S.ConfigInputContainer>
          <S.CurrencyInput
            name="Bitcoin average growth per year"
            type="number"
            min="1"
            suffix="%"
            value={bitcoinGrowthPerYear || ""}
            onChange={(e) => {
              updateStore({
                bitcoinGrowthPerYear: Number.parseFloat(e.target.value)
              });
            }}
          />
          <S.InputExplaination>
            How much, in average, the BTC grow every year. Historically, it is
            close to 100%
          </S.InputExplaination>
        </S.ConfigInputContainer>
      </S.AdvancedModeContainer>
      <S.SubmitButton
        onClick={() => {
          updateStore({ isConfigSet: true });
        }}
      >
        Save
      </S.SubmitButton>
      <S.AdvancedConfigurationButton isReversed>
        <S.ButtonText h5 color="white" weight={600}>
          Import config
        </S.ButtonText>
        <S.InputBox
          type="file"
          onChange={async (e: any) => {
            const fileText = (await readFile(e.target.files[0])) as string;
            const parsed = JSON.parse(fileText);
            updateStore({ ...parsed, isConfigSet: true });
          }}
        />
      </S.AdvancedConfigurationButton>
      {isComparaisonModalOpen ? (
        <DemoModal
          title="DCA vs DVA performances history"
          onClose={() => {
            setIsComparaisonModalOpen(false);
            setStorePath("history", []);
            setStorePath("dcaCompareHistory", []);
          }}
        />
      ) : null}
    </S.SetupConfigContainer>
  );
};

const currencyItemsMap = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "CHF", value: "chf" }
];

const investModeMap = [
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" }
];

const weeklyDayMap = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "7" }
];
