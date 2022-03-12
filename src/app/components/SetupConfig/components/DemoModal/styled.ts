import styled from "styled-components";
import { Modal, Input as RootInput } from "@bitcoin-dva/components";
import { HistoryCard as RootHistoryCard } from "@bitcoin-dva/components/Dashboard/components/HistoryCard";

export const DemoModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Input = styled(RootInput)`
  & ~ & {
    margin-top: 32px;
  }
`;

export const HistoryCard = styled(RootHistoryCard)`
  margin-top: 16px;
  box-shadow: none;
  width: 100%;
`;
