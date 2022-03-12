import styled from "styled-components";
import { Text, Button, Div, Modal } from "@bitcoin-dva/components";

export const BitcoinDVATitle = styled(Text)`
  margin: 0px;
  top: 0px;
  left: 0px;
  margin-bottom: 16px;
`;

export const AppContainer = styled(Div)`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1500px;
  height: fill-available;
  padding: 64px;
  padding-bottom: 16px;

  @media (max-width: 1200px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const CardsContainer = styled(Div)`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const AppSide = styled(Div)`
  flex: 1;
  display: flex;
  flex-direction: column;

  & ~ & {
    margin-top: 32px;
    @media (min-width: 1201px) {
      margin-top: 0px;
      margin-left: 32px;
    }
  }
`;

export const AppSideCard = styled(Div)<{
  isColumn?: boolean;
  isSpecialBackground?: boolean;
}>`
  display: flex;
  position: relative;
  flex-direction: ${({ isColumn }) => (isColumn ? "column" : "row")};
  ${({ isSpecialBackground }) =>
    isSpecialBackground
      ? `
          background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
        `
      : "background-color: white;"}
  padding: 24px 32px;
  border-radius: 24px;
  display: flex;
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium);

  & ~ & {
    margin-top: 32px;
  }
`;

export const WalletCardSide = styled(Div)`
  padding-right: 16px;
  flex: 1;

  & ~ & {
    padding-right: 0px;
    padding-left: 16px;
    border-left: 1px solid rgb(241, 242, 246);
  }
`;

export const WalletSideTitle = styled(Text).attrs(() => ({
  h3: true,
  weight: 600
}))<{ isCentered?: boolean }>`
  margin: 0px;
  line-height: 1;
  text-align: ${({ isCentered }) => (isCentered ? "center" : "start")};
`;

export const WalletSideSubTitle = styled(Text).attrs(() => ({
  h5: true,
  color: "#ced6e0"
}))`
  margin: 0px;
  margin-top: 4px;
`;

export const WalletSideContent = styled(Div)`
  margin-top: 32px;
`;

type WalletSideContentLineProps = {
  isSubline?: boolean;
  color?: string;
};

export const WalletSideContentLine = styled(Text).attrs(
  ({ isSubline, color }: WalletSideContentLineProps) => ({
    weight: 400,
    color: color || "#2f3542",
    ...(isSubline ? {} : { h4: true })
  })
)<WalletSideContentLineProps>`
  margin: 0px;
  margin-top: 4px;
  ${({ isSubline }) => (isSubline ? "font-size: 14px;" : "")}
`;

export const CategoryTitle = styled(Text).attrs(() => ({
  h3: true,
  weight: 600
}))``;

export const SimpleText = styled(Text)``;

export const BtcPriceView = styled(Text)`
  position: absolute;
  background: white;
  padding: 2px 6px;
  top: 0px;
  right: 0px;
  margin: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom-left-radius: 6px;
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium);
`;

export const BtcImg = styled.img`
  margin-right: 4px;
`;

export const ResetConfigButton = styled(Button)`
  margin-top: 16px;
`;

export const OperationContentContainer = styled(Div)`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const OperationNotTodayExplaination = styled(Text)`
  margin: 0px;
`;

export const OperationTextLine1 = styled(Text)`
  margin: 0px;
`;

export const OperationTextLine2 = styled(Text)`
  margin: 0px;
  margin-top: 16px;
`;

export const OperationTextLine3 = styled(Text)`
  margin: 16px 0px;
`;

export const OperationActionLine = styled(Div)`
  border: 4px solid white;
  border-radius: 16px;
  margin-top: 16px;
  width: fit-content;
  padding: 0px 32px;
`;

export const OperationTextLine4 = styled(Text)`
  margin: -8px 0px;
`;

export const ValidateExplaination = styled(Text)`
  margin-top: 32px;
`;

export const OperationValidate = styled(Button)``;

export const ConfigCard = styled(AppSideCard)`
  height: 163px;
  @media (max-width: 1200px) {
    margin-bottom: 32px;
  }
`;

export const ConfigSideTitle = styled(Text).attrs(() => ({
  h3: true,
  weight: 600
}))<{ isCentered?: boolean }>`
  margin: 0px;
  line-height: 1;
  text-align: ${({ isCentered }) => (isCentered ? "center" : "start")};
`;

export const ConfigContent = styled(Div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const ConfigButton = styled(Button)`
  width: fit-content;
  flex: 1;

  border: 2px solid #2f3542;
  box-shadow: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & ~ & {
    margin-left: 32px;
  }
`;

export const ConfigText = styled(Text).attrs(() => ({
  weight: 500,
  h4: true
}))`
  margin-left: 8px;
`;

export const SupportMessage = styled(Text)`
  margin: 0px;
  text-decoration: none !important;
  & ~ & {
    margin-top: 4px;
  }
`;

export const ConfirmationModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
