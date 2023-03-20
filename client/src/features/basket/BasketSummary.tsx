import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useStoreContext } from '../../app/context/StoreContext';
import { currencyFormat } from '../../app/util/util';

export default function BasketSummary() {
  const { basket } = useStoreContext();
  const receipt: { [k: string]: number } = {
    subtotal: basket?.items.reduce((priceState, item) => priceState + item.price * item.quantity, 0) ?? 0,
    get 'delivery_fee*'() {
      return this.subtotal / 100 > 100 ? 0 : 500;
    },
    get total() {
      return this.subtotal + this['delivery_fee*'];
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {Object.entries<number>(receipt)?.map(([k, v]) => {
            return (
              <TableRow key={k}>
                <TableCell>{k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ')}</TableCell>
                <TableCell align="right">{currencyFormat(v)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow key={'*'}>
            <TableCell>* Orders over $100 qualify for free delivery</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
