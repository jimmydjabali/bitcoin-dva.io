import styled from "styled-components";

type TextProps = {
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

export const Text = styled(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({
    weight,
    italic,
    innerRef,
    isCentered,
    isWhite,
    h1,
    h2,
    h3,
    h4,
    h5,
    ...props
  }) => <p ref={innerRef} {...props} />
)<TextProps>`
  color: ${({ isWhite, color }) => color || (isWhite ? "white" : "#2f3542")};
  fill: ${({ isWhite, color }) => color || (isWhite ? "white" : "#2f3542")};
  font-family: ${({ weight = 400, italic }) =>
    `Poppins-${(() => {
      switch (weight) {
        case 100:
          return "Thin";
        case 200:
          return "ExtraLight";
        case 300:
          return "Light";
        case 400:
          return !italic ? "Regular" : "";
        case 500:
          return "Medium";
        case 600:
          return "SemiBold";
        case 700:
          return "Bold";
        case 800:
          return "ExtraBold";
        case 900:
          return "Black";
        default:
          return undefined;
      }
    })()}${(() => (italic ? "Italic" : ""))()}`};
  font-size: ${({ h1, h2, h3, h4, h5 }) => {
    switch (true) {
      case !!h1:
        return 48;
      case !!h2:
        return 34;
      case !!h3:
        return 28;
      case !!h4:
        return 17;
      case !!h5:
        return 15;
      default:
        return 19;
    }
  }}px;
  ${({ selectable = true, editable = true }) => `${
    !selectable ? "user-select: none;" : ""
  }
  ${!editable ? "cursor: auto;" : ""}`}
  ${({ isCentered }) => (isCentered ? "text-align: center;" : "")}
`;
