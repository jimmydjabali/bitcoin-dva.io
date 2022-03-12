import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Icon = styled(FontAwesomeIcon)`
  color: ${({ color }) => (color ? color : "inherit")} !important;
`;
