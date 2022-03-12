import styled, { StyledComponentPropsWithRef } from "styled-components";
import { Div, Text, Icon, Button } from "@bitcoin-dva/components";

type ModalProps = StyledComponentPropsWithRef<typeof Div> & {
  title: string;
  onClose: () => void;
  overlay?: { height?: number; width?: number };
  description?: React.ReactElement | string;
  confirmButton?: string;
  confirmFn?: () => void;
};

export const Modal = styled(
  ({
    children,
    title,
    onClose,
    overlay,
    description,
    confirmButton,
    confirmFn,
    ...props
  }: ModalProps) => {
    return (
      <ModalBackground>
        <ModalOverlay overlay={overlay}>
          <TitleLine weight={600}>
            {title}
            <CloseButton onClick={onClose}>
              <Icon icon="xmark" size="lg" color="#ced6e0" />
            </CloseButton>
          </TitleLine>
          <Div {...props}>
            {description ? (
              <ModalDescription h5>{description}</ModalDescription>
            ) : (
              children
            )}
            {confirmButton ? (
              <ModalConfirmButton onClick={confirmFn}>
                {confirmButton}
              </ModalConfirmButton>
            ) : null}
          </Div>
        </ModalOverlay>
      </ModalBackground>
    );
  }
)<ModalProps>`
  padding: 32px;
  padding-top: 0px;
`;

const ModalDescription = styled(Text)``;

const ModalConfirmButton = styled(Button)`
  margin-top: 16px;
`;

const ModalBackground = styled(Div)`
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0px;
  right: 0px;
  box-shadow: none;
  width: 73px;
  height: 73px;
  background: transparent !important;
`;

const ModalOverlay = styled(Div)<{
  overlay?: { width?: number; height?: number };
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ overlay: { width = 300, height } = {} }) => `
    ${width ? `width: ${width}px;` : ""}
    ${height ? `height: ${height}px;` : ""}
  `}

  background-color: white;
  border-radius: 12px;
  --shadow-color: 229deg 7% 60%;
  --shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
    0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
    2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
    5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
  box-shadow: var(--shadow-elevation-medium);
`;

const TitleLine = styled(Text)`
  margin: 0px;
  padding: 22px 0px;
`;
