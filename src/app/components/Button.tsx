import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { Text } from "@bitcoin-dva/components";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isReversed?: boolean;
};

export const Button = styled(
  ({ children, isReversed, ...props }: ButtonProps) => (
    <button {...props}>
      {typeof children === "string" ? (
        <ButtonText h4 weight={500} isWhite={isReversed}>
          {children}
        </ButtonText>
      ) : (
        children
      )}
    </button>
  )
)<ButtonProps>`
  cursor: pointer;
  border: none;
  background: none;
  background-color: white;
  border-radius: 12px;
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium);
  width: 330px;
  height: 42px;
  min-height: 42px;
  transition: all 0.2s ease-in-out;
  ${({ isReversed }) =>
    isReversed
      ? ` background-color: transparent; \
          box-shadow: none;
          width: fit-content;
          min-height: fit-content;
        `
      : `
        &:hover {
          background-color: #f1f2f6;
        }
      
        &:active {
          background-color: #dfe4ea;
        }
      `}
`;

const ButtonText = styled(Text)`
  margin: 0px;
`;
