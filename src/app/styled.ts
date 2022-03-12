import styled from "styled-components";
import { Text, Div } from "@bitcoin-dva/components";

export const AppContainer = styled(Div)`
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;
  position: relative;
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
`;

export const BtcImg = styled.img`
  margin-right: 4px;
`;

export const InfoContainer = styled(Div)<{ isConfigSet: boolean }>`
  position: fixed;
  bottom: 0px;
  right: ${({ isConfigSet }) => (isConfigSet ? 4 : 22)}px;
  display: flex;
  flex-direction: row;
`;

export const InfoText = styled(Text).attrs(() => ({ as: "a" }))`
  font-size: 10px;
  margin: 0px;
  text-decoration: none;

  & ~ & {
    margin-left: 4px;
  }
`;

export const ChangelogTextList = styled.ul`
  text-align: start;
`;
