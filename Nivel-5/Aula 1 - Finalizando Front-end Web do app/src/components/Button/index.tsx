import React, { ButtonHTMLAttributes } from 'react';

import { boolean } from 'yup';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...restx }) => (
  <Container type="button" {...restx}>
    {loading ? 'Carregando...' : children}
  </Container>
);

export default Button;
