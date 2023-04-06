import styled from "@emotion/styled";
import { Card as MUICard, CardActions as MUICardActions } from "@mui/material";

export const Card = styled(MUICard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 15px;
  height: 100%;
  position: relative;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
`;

export const Overlay2 = styled.div`
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
