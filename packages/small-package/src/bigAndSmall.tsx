import { BigComponent } from '@icehunter/big-package';
import React from 'react';
import { SmallComponent } from './small';

export const BigAndSmallComponent = () => {
  return (
    <React.Fragment>
      <SmallComponent />
      <BigComponent />
    </React.Fragment>
  );
};
