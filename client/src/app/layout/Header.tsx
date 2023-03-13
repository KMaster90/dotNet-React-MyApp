import { AppBar, Switch, Toolbar, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

interface Props {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: Props) {
  function switchTheme(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
    setDarkMode(checked);
  }
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6">RE-STORE</Typography>
        <Switch checked={darkMode} onChange={switchTheme} />
      </Toolbar>
    </AppBar>
  );
}
