import { LoadingButton } from '@mui/lab';
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../../app/api/agent';
import { useStoreContext } from '../../app/context/StoreContext';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Product } from '../../app/models/product';
import { currencyFormat } from '../../app/util/util';

export default function ProductDetailPage() {
  const { basket, setBasket, removeItem } = useStoreContext();
  let { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const item = basket?.items?.find((item) => item.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    id &&
      agent.Catalog.details(id)
        .then((product) => {
          console.log('Effect', product);
          setProduct(product);
        })
        .catch(console.log)
        .finally(() => setLoading(false));
  }, [id, item]);

  function handleInputChange({ target: { value = '0' } = {} }: any = {}) {
    value >= 0 && setQuantity(Number(value));
  }

  function handleUpdateCart() {
    setSubmitting(true);
    if (!item || quantity > item?.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      agent.Basket.addItem(product?.id!, updatedQuantity)
        .then(({ value: basket }) => {
          console.log('UpdateAdd', basket);
          setBasket(basket);
        })
        .catch((err) => console.log('AddItem ERROR', err))
        .finally(() => setSubmitting(false));
    } else if (quantity < item.quantity) {
      const updatedQuantity = item.quantity - quantity;
      agent.Basket.removeItem(product?.id!, updatedQuantity)
        .then(() => removeItem(product?.id!, updatedQuantity))
        .catch(console.log)
        .finally(() => setSubmitting(false));
    }
  }

  if (loading) return <LoadingComponent message="Loading products..." />;
  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color={'secondary'}>
          {currencyFormat(product.price)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
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
              loading={submitting}>
              {item ? 'Update Quantity' : 'Add to Cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
