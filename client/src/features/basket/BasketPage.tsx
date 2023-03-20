import { Add, Delete, Remove } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { currencyFormat } from '../../app/util/util';
import { useAppDispatch, useAppSelector } from '../contact/configureStore';
import { addBasketItemAsync, removeBasketItemAsync } from './basketSlice';
import BasketSummary from './BasketSummary';

export default function BasketPage() {
  const { basket, status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price&nbsp;($)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket?.items?.map((item) => {
              return (
                <TableRow key={item.productId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <img src={item.pictureUrl} alt={item.name} style={{ height: '50px', marginRight: '10px' }} />
                      <span>{item.name} </span>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{currencyFormat(item.price)}</TableCell>
                  <TableCell align="center">
                    <LoadingButton
                      loading={status === 'pendingRemoveItem' + item.productId}
                      color="error"
                      onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId }))}>
                      <Remove />
                    </LoadingButton>
                    {item.quantity}
                    <LoadingButton
                      loading={status === 'pendingAddItem' + item.productId}
                      color="secondary"
                      onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}>
                      <Add />
                    </LoadingButton>
                  </TableCell>
                  <TableCell align="right">{currencyFormat(item.price * item.quantity)}</TableCell>
                  <TableCell align="right">
                    <LoadingButton
                      loading={status === 'pendingRemoveItem' + item.productId + 'del'}
                      color="error"
                      onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: 'del' }))}>
                      <Delete />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={6}>
          <BasketSummary />
          <Button component={Link} to={'/checkout'} variant="contained" size="large" fullWidth>
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
