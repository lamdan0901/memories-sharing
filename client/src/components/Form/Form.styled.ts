import styled from "@emotion/styled";

export const FormWrapper = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const FileInput = styled.input`
  width: 140px;

  &::-webkit-file-upload-button {
    visibility: hidden;
  }

  &::before {
    content: "Select your image";
    display: inline-block;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 8px;
    outline: none;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }

  &:hover::before {
    background-color: #eeeeff8c;
  }
`;
