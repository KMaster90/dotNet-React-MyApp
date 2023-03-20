import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { currencyFormat } from '../../app/util/util';
import { addBasketItemAsync, removeBasketItemAsync } from '../basket/basketSlice';
import { useAppDispatch, useAppSelector } from '../contact/configureStore';
import { fetchProductAsync, productSelectors } from './catalogSlice';

export default function ProductDetailPage() {
  const { basket, status } = useAppSelector((state) => state.basket);
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  let { id } = useParams<{ id: string }>();
  const product = useAppSelector((state) => productSelectors.selectById(state, id || 0));
  const [quantity, setQuantity] = useState<number>(0);
  const item = basket?.items?.find((item) => item.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, product, dispatch]);

  function handleInputChange({ target: { value = '0' } = {} }: any = {}) {
    value >= 0 && setQuantity(Number(value));
  }

  function handleUpdateCart() {
    if (!item || quantity > item?.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    } else if (quantity < item.quantity) {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    }
  }

  if (productStatus.includes('pending')) return <LoadingComponent message="Loading products..." />;
  if (!productStatus.includes('pending') && !product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product?.pictureUrl} alt={product?.name} style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product?.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color={'secondary'}>
          {currencyFormat(product?.price || 0)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product?.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product?.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product?.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TextField variant="outlined" type="number" label="Quantity in Cart" fullWidth value={quantity} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={quantity === item?.quantity || (!item && quantity === 0)}
              sx={{ height: '55px' }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
              onClick={handleUpdateCart}
              loading={status === 'pendingAddItem' + item?.productId}>
              {item ? 'Update Quantity' : 'Add to Cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
