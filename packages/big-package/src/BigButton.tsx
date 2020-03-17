import { Button } from '@material-ui/core';
import React from 'react';

type BigButtonProps = {
  children?: any;
};

export const BigButton: React.FC<BigButtonProps> = (props) => {
  return (
    <Button>
      Big Button with Children
      {props.children}
    </Button>
  );
};
