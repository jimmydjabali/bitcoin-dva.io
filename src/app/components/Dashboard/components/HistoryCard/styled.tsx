import styled from "styled-components";
import { Text, Div } from "@bitcoin-dva/components";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Tooltip as RootTooltip } from "@visx/tooltip";

export const HistoryListContainer = styled(Div)`
  position: relative;
  display: flex;
  flex-direction: row;
`;

export const HistoryListLine = styled(Text)`
  margin: 0px;
`;

export const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

const pointSize = 16;

export const Point = styled.circle`
  width: ${pointSize}px;
  height: ${pointSize}px;
  z-index: 10000;
`;

export const AxisLabel = styled(Text)`
  font-size: 12px;
`;

const AxisTickLabel = styled(Text)`
  font-size: 9px;
  margin: 0px;
`;

export const Axis = styled(({ isLeft, className, ...props }) => {
  const Component = isLeft ? AxisLeft : AxisBottom;
  return (
    <Component
      tickComponent={(e) => (
        <AxisTickLabel as="text" {...e}>
          {e.formattedValue}
        </AxisTickLabel>
      )}
      {...props}
    />
  );
})``;

export const HistoryLegend = styled(Div)`
  margin-right: 32px;
  padding-top: 32px;
  width: 130px;
`;

type LegendProps = {
  name: string;
  color: string;
  btc: number;
  walletValueInCurrency: number;
  currency: string;
};

export const Legend = ({
  name,
  color,
  btc,
  walletValueInCurrency,
  currency
}: LegendProps) => (
  <LegendContainer>
    <LegendLine>
      <LegendColor color={color} />
      <LegendName h4>{name}</LegendName>
    </LegendLine>
    <LegendLine>
      <LegendBTC h5>
        {btc.toFixed(8)} BTC
        <br />
        {walletValueInCurrency} {currency}
      </LegendBTC>
    </LegendLine>
  </LegendContainer>
);

const LegendContainer = styled(Div)`
  text-align: left;

  & ~ & {
    margin-top: 16px;
  }
`;

const LegendLine = styled(Div)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LegendColor = styled(Div)<{ color: string }>`
  width: 16px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ color }) => color};
`;

const LegendName = styled(Text)`
  margin: 0px;
  margin-left: 8px;
`;

const LegendBTC = styled(Text)`
  margin: 0px;
  font-size: 12px;
`;

export const Tooltip = styled(RootTooltip)`
  background-color: #2f3542 !important;
  border-radius: 12px !important;
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium) !important;
  z-index: 1000;
  padding: 16px !important;
  text-align: left;
`;

export const TooltipText = styled(Text).attrs(() => ({ color: "white" }))`
  margin: 0px;
`;
