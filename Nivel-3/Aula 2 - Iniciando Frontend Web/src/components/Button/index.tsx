import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...restx }) => (
  <Container type="button" {...restx}>
    {children}
  </Container>
);

export default Button;
