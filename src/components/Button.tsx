import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

const Button = styled.button`
  background-color: ${(props: ButtonProps) =>
    props.active ? `crimson` : `cornflowerblue`};
  border: 0;
  border-radius: 4px;
  color: white;
  font-family: $font;
  text-shadow: 1px 2px 3px black;
  padding: 0.25rem 0.5rem 0.35rem;
  margin: 0 0.5rem;

  &:focus {
    outline: none;
  }
`;

export default ({ label, active, onClick }: ButtonProps) => (
  <Button type="button" active={active} onClick={onClick}>
    {label}
  </Button>
);
