import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@bitcoin-dva/hooks";
import * as S from "./styled";
import * as DashboardStyled from "../../styled";
import { Group } from "@visx/group";
import { useTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { GridRows, GridColumns } from "@visx/grid";
import { parse, setDate } from "date-fns";
import { HistoryPoint } from "@bitcoin-dva/config/globalStore";

// accessors
const price = (historyPoint: HistoryPoint) =>
  historyPoint.walletValueInCurrency;

const margin = { top: 40, right: 40, bottom: 40, left: 40 };

export type ThresholdProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

type HistoryCardProps = {
  hideTitle?: boolean;
  className?: string;
};

export const HistoryCard = ({ hideTitle, className }: HistoryCardProps) => {
  const { history, dcaCompareHistory, currency, mode } = useStore([
    "history",
    "dcaCompareHistory",
    "currency",
    "mode"
  ]);
  const historyContentRef = useRef<SVGSVGElement>(null);

  const date = useCallback(
    (historyPoint: HistoryPoint) => {
      const parsedDate = parse(
        historyPoint.date,
        "dd-MM-yyyy",
        new Date()
      ).valueOf();
      if (mode === "monthly") {
        return setDate(parsedDate, 1).valueOf();
      }
      return parsedDate;
    },
    [mode]
  );

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip
  } = useTooltip<HistoryPoint & { isDca: boolean }>();

  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const currencyUppercase = useMemo(() => currency.toUpperCase(), [currency]);

  // scales
  const timeScale = useMemo(
    () =>
      scaleTime<number>({
        domain: [Math.min(...history.map(date)), Math.max(...history.map(date))]
      }),
    [history.length, date]
  );

  const priceScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [
          Math.min(...history.map(price)),
          Math.max(...history.map(price))
        ],
        nice: true
      }),
    [history.length]
  );

  // bounds
  const xMax = svgSize.width - margin.left - margin.right;
  const yMax = svgSize.height - margin.top - margin.bottom;

  timeScale.range([0, xMax]);
  priceScale.range([yMax, 0]);

  const setSvgSizeFn = useCallback(() => {
    if (historyContentRef.current) {
      const newSize = {
        width: historyContentRef.current.clientWidth,
        height: historyContentRef.current.clientHeight
      };
      setSvgSize({ width: newSize.width, height: newSize.width });
    }
  }, [historyContentRef.current]);

  useEffect(() => {
    setSvgSizeFn();
    window.addEventListener("resize", setSvgSizeFn);
  }, [setSvgSizeFn]);

  const onMouseOverPoint = useCallback(
    (point: HistoryPoint, isDca: boolean) => (event: any) => {
      const coords = localPoint(event.target.ownerSVGElement, event);
      if (coords) {
        showTooltip({
          tooltipLeft: coords.x,
          tooltipTop: coords.y - 155 - (hideTitle ? 30 : 0),
          tooltipData: { ...point, isDca }
        });
      }
    },
    [showTooltip, hideTitle]
  );

  const onMouseOutPoint = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const getLineWithPoints = useCallback(
    (pointsList: HistoryPoint[], color: string, isDca: boolean = false) => (
      <>
        <LinePath
          data={pointsList}
          x={(d) => timeScale(date(d)) ?? 0}
          y={(d) => priceScale(price(d)) ?? 0}
          stroke={color}
          strokeWidth={3}
          strokeOpacity={1}
        />
        {pointsList.map((p) => (
          <S.Point
            cx={timeScale(date(p)) ?? 0}
            cy={priceScale(price(p)) ?? 0}
            r={4}
            fill={color}
            onMouseOver={onMouseOverPoint(p, isDca)}
            onMouseOut={onMouseOutPoint}
          />
        ))}
      </>
    ),
    [timeScale, priceScale, onMouseOverPoint, onMouseOutPoint]
  );

  return (
    <>
      <DashboardStyled.AppSideCard isColumn className={className}>
        {!hideTitle ? (
          <DashboardStyled.WalletSideTitle>
            History
          </DashboardStyled.WalletSideTitle>
        ) : null}
        <S.HistoryListContainer>
          <S.HistoryLegend>
            <S.Legend
              name="DVA"
              color="#1e90ff"
              btc={history[history.length - 1]?.btcAmount || 0}
              walletValueInCurrency={Math.round(
                history[history.length - 1]?.walletValueInCurrency || 0
              )}
              currency={currencyUppercase}
            />
            <S.Legend
              name="DCA"
              color="#ced6e0"
              btc={
                dcaCompareHistory[dcaCompareHistory.length - 1]?.btcAmount || 0
              }
              walletValueInCurrency={Math.round(
                dcaCompareHistory[dcaCompareHistory.length - 1]
                  ?.walletValueInCurrency || 0
              )}
              currency={currencyUppercase}
            />
          </S.HistoryLegend>
          <S.SvgContainer
            ref={historyContentRef}
            width={svgSize.width}
            height={svgSize.height}
          >
            <Group left={margin.left} top={margin.top}>
              <GridRows
                scale={priceScale}
                width={xMax}
                height={yMax}
                stroke="#e0e0e0"
              />
              <GridColumns
                scale={timeScale}
                width={xMax}
                height={yMax}
                stroke="#e0e0e0"
              />
              <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
              <S.Axis
                top={yMax}
                scale={timeScale}
                numTicks={svgSize.width > 520 ? 10 : 5}
              />
              <S.Axis isLeft scale={priceScale} />
              <S.AxisLabel as="text" x="-40" y="-20">
                Wallet value ({currencyUppercase})
              </S.AxisLabel>
              {getLineWithPoints(dcaCompareHistory, "#ced6e0", true)}
              {getLineWithPoints(history, "#1e90ff")}
            </Group>
          </S.SvgContainer>
          {false &&
            history.map((historyPoint) => (
              <S.HistoryListLine>
                {historyPoint.date}: {historyPoint.btcAmount} -{" "}
                {historyPoint.investedInCurrency} {currencyUppercase}
              </S.HistoryListLine>
            ))}
        </S.HistoryListContainer>
        {tooltipOpen && tooltipData && (
          <S.Tooltip key={Math.random()} top={tooltipTop} left={tooltipLeft}>
            <S.TooltipText h4 weight={600}>
              {tooltipData.isDca ? "DCA" : "DVA"} investment
            </S.TooltipText>
            <br />
            <S.TooltipText h5>
              Wallet value : {Math.round(tooltipData.walletValueInCurrency)}{" "}
              {currencyUppercase}
            </S.TooltipText>
            <br />
            <S.TooltipText h5>
              Total invested : {Math.round(tooltipData.investedInCurrency)}{" "}
              {currencyUppercase}
            </S.TooltipText>
            <br />
            <S.TooltipText h5>
              Performance :{" "}
              {Math.round(
                (tooltipData.walletValueInCurrency /
                  tooltipData.investedInCurrency -
                  1) *
                  100
              )}
              %
            </S.TooltipText>
            <br />
            <S.TooltipText h5>
              Total BTC :{" "}
              {tooltipData.btcAmount.toFixed(8).replace(/\.?0+$/, "")}
            </S.TooltipText>
            <br />
            <S.TooltipText h5>{tooltipData.date}</S.TooltipText>
          </S.Tooltip>
        )}
      </DashboardStyled.AppSideCard>
    </>
  );
};
