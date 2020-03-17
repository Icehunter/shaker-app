import React, { useState } from 'react';
import { TextField, makeStyles } from '@material-ui/core';

import { BigButton } from '@icehunter/big-package';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

const smallText = (): string => {
  return 'Mew!';
};

export const SmallComponent = () => {
  const classes = useStyles();
  const [value, setValue] = useState(smallText());

  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete='off'>
      <TextField id='standard-multiline-flexible' label='Multiline' multiline rowsMax='4' value={value} onChange={handleChange} />
      <BigButton>Submit</BigButton>
    </form>
  );
};
