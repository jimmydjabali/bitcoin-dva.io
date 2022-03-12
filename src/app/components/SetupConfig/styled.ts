import styled from "styled-components";
import { Text, Div, Input, Button } from "@bitcoin-dva/components";

export const SetupConfigContainer = styled(Div)`
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 64px 0px;
`;

export const WelcomeText = styled(Text)`
  margin-top: 0px;
`;

export const ShortExplainationText = styled(Text)`
  margin-bottom: 64px;
`;

export const DCAComparaisonButton = styled(Button)`
  border: 4px solid white;
  padding: 4px 12px;
  width: 330px;
`;

export const ConfigInputContainer = styled(Div)`
  display: flex;
  flex-direction: column;
  & ~ & {
    margin-top: 32px;
  }
`;

export const CurrencyInput = styled(Input)``;

export const InputExplaination = styled(Text).attrs(() => ({
  color: "white"
}))`
  max-width: fit-content;
  text-align: start;
  font-size: 14px;
`;

export const AdvancedConfigurationButton = styled(Button)`
  color: white;
  margin-top: 32px;
  position: relative;
`;

const advancedModeHeight = 125;

export const AdvancedModeContainer = styled(Div)<{ isOpen: boolean }>`
  margin: 32px 0px;
  padding: 0px 8px;
  min-height: ${({ isOpen }) => (isOpen ? advancedModeHeight : 0)}px !important;
  height: ${({ isOpen }) => (isOpen ? advancedModeHeight : 0)}px !important;
  transition: 0.8s ease-in-out all;
  overflow: hidden;
  flex-direction: column;
`;

export const SubmitButton = styled(Button)``;

export const ButtonText = styled(Text)`
  margin: 0px;
  overflow: hidden;
  position: relative;
`;

export const InputBox = styled.input`
  position: absolute;
  widht: 100%;
  z-index: 1;
  height: 100%;
  opacity: 0;
  top: 0px;
  right: 0px;
  cursor: pointer !important;
`;
