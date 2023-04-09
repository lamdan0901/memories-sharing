import styled from "@emotion/styled";
import { Card as MUICard, CardActions as MUICardActions } from "@mui/material";

export const Card = styled(MUICard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px;
  height: 100%;
  position: relative;
  background-color: #eeeeff8c;
  box-shadow: 0px 0px 15px 1px #7163e544;

  &:hover {
    box-shadow: 0px 0px 15px 1px #7163e577;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
`;

export const CardActions = styled(MUICardActions)`
  padding: 0 16px 8px 16px;
  display: flex;
  justify-content: space-between;
`;
