import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Product } from '../../app/models/product';
import ProductList from './ProductList';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  function addProduct() {
    setProducts((prevState) => [
      ...prevState,
      {
        id: prevState.length + 101,
        name: `product ${prevState.length + 1}`,
        price: 1000.0 * (prevState.length + 1),
        description: 'description',
        brand: 'brand',
        pictureUrl: `http://picsum.photos/${prevState.length + 101}`
      }
    ]);
  }
  return (
    <>
      <ProductList products={products} />
      <Button variant="contained" onClick={addProduct}>
        Add Product
      </Button>
    </>
  );
}
