import { useState, InputHTMLAttributes } from "react";
import styled from "styled-components";
import { Text, Div, Button } from "@bitcoin-dva/components";
import useOnclickOutside from "react-cool-onclickoutside";

type ItemType = { label: string; value: string };

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  itemsList?: ItemType[];
  suffix?: string;
};

export const Input = styled(
  ({ className, itemsList, suffix, ...props }: InputProps) => {
    const [isFocused, setIsFocused] = useState(props.value !== undefined);
    const [isItemsListOpen, setIsItemsListOpen] = useState(false);
    const itemsListOverlayRef = useOnclickOutside(() => {
      setIsItemsListOpen(false);
    });

    return (
      <Div className={className}>
        <PlaceholderText h4 weight={400} isFocused={isFocused}>
          {props.name}
        </PlaceholderText>
        {suffix ? <SuffixText h5>{suffix}</SuffixText> : null}
        <>
          <InputInput
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={(e) => {
              props.onBlur?.(e);
              if (e.target.value === "") {
                setIsFocused(false);
              }
            }}
            {...props}
          />
          {itemsList && !props.disabled ? (
            <>
              {isItemsListOpen ? (
                <ItemsListOverlay ref={itemsListOverlayRef}>
                  {itemsList.map((item, index) => (
                    <ItemsItem
                      key={index}
                      onClick={() => {
                        props.onChange?.({
                          target: { value: item.value }
                        } as any);
                        setIsItemsListOpen(false);
                      }}
                    >
                      {item.label}
                    </ItemsItem>
                  ))}
                </ItemsListOverlay>
              ) : null}
              <ItemsListButton
                onClick={() => {
                  setIsItemsListOpen(true);
                }}
              />
            </>
          ) : null}
        </>
      </Div>
    );
  }
)<InputProps>`
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium);
  background-color: ${({ disabled }) => (disabled ? "#ced6e0" : "white")};
  border: none;
  border-radius: 12px;
  width: 330px;
  height: 42px;
  display: flex;
  position: relative;
`;

const SuffixText = styled(Text)`
  position: absolute;
  margin: 0px;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;

const ItemsItem = styled(Text)`
  cursor: pointer;

  &:hover {
    background-color: #f1f2f6;
  }
  margin: 0px;
  padding: 8px 0px;
`;

const ItemsListButton = styled(Button)`
  position: absolute;

  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: transparent !important;
  box-shadow: none;
`;

const ItemsListOverlay = styled(Div)`
  position: absolute;
  background-color: white;
  z-index: 2;
  height: fit-content;
  min-width: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

export const PlaceholderText = styled(({ isFocused, ...props }) => (
  <Text {...props} />
))<{ isFocused: boolean }>`
  color: #a4b0be;
  position: absolute;
  transition: 0.2s ease all;
  top: ${({ isFocused }) => (isFocused ? 2 : 8)}px;
  left: ${({ isFocused }) => (isFocused ? 8 : 12)}px;
  font-size: ${({ isFocused }) => (isFocused ? 11 : 17)}px;
  margin: 0px;
`;

export const InputInput = styled.input`
  border: 0px;
  z-index: 1;
  background-color: transparent;
  flex: 1;
  outline: none !important;
  padding: 12px 12px 4px 12px;
  font-family: Poppins-Regular;
`;
