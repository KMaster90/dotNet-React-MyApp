import { Button, ButtonGroup, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from './configureStore';
import { decrement, increment } from './counterSlice';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { data, title } = useAppSelector((state) => state.counter);
  return (
    <>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="h5">The data is: {data}</Typography>
      <ButtonGroup>
        <Button variant="contained" color="error" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button variant="contained" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
        <Button variant="contained" color="warning" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}
