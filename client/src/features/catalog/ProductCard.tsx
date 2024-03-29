import { LoadingButton } from '@mui/lab';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Product } from '../../app/models/product';
import { currencyFormat } from '../../app/util/util';
import { addBasketItemAsync } from '../basket/basketSlice';
import { useAppDispatch, useAppSelector } from '../contact/configureStore';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  return (
    <Card>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{product.name?.charAt(0).toUpperCase()}</Avatar>}
        title={product.name}
        titleTypographyProps={{ sx: { fontWeight: 'bold', color: 'primary.main' } }}
      />
      <CardMedia sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }} image={product.pictureUrl} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          size="small"
          loading={status === 'pendingAddItem' + product.id}
          onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}>
          Add to cart
        </LoadingButton>
        <Button size="small" component={Link} to={`/catalog/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
