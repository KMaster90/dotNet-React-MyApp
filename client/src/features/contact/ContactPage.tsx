import { Button, ButtonGroup, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CounterState, decrement, DECREMENT_COUNTER, increment, INCREMENT_COUNTER } from './counterReducer';

export default function ContactPage() {
  const dispatch = useDispatch();
  const { data, title } = useSelector((state: CounterState) => state);
  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is: {data}</Typography>
      <ButtonGroup>
        <Button variant="contained" color="error" onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
        <Button variant="contained" onClick={() => dispatch(increment())}>
          Increment
        </Button>
        <Button variant="contained" color="warning" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}
