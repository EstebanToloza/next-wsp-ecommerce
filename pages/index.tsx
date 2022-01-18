import { Button, Grid, Link, Stack, Text } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import React, { useMemo, useState } from 'react'
import api from '../product/api'
import { Product } from '../product/types'

interface Props {
  products: Product[];
}

function parseCurrency(value: number): string  {
  return value.toLocaleString('es-Ar', {
    style: 'currency',
    currency: 'ARS'
  })
}

const IndexRoute : React.FC<Props> = ({products}) => {

  const [cart, setCart] = useState<Product[]>([]);
  const text = useMemo(
    () => 
      cart
        .reduce(
          (message, product) => message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
          ``,
        )
        .concat(`\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`),
    [cart],
  );

  return (
    <Stack>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map(product =>
          <Stack key={product.id} backgroundColor="gray.100">
            <Text>{product.title}</Text>
            <Text>{parseCurrency(product.price)}</Text>
            <Button colorScheme="blue" onClick={() => setCart(cart => cart.concat(product))}>Agregar</Button>
          </Stack>
        )}
      </Grid>
      {cart.length && (
        <Button 
          as={Link} 
          colorScheme="whatsapp"
          href={`https://wa.me/5493412293564?text=${encodeURIComponent(text)}`} 
          isExternal
        >
          Ver carrito ({cart.length}) productos
        </Button>
      )}
    </Stack>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products,
    },
    revalidate: 60
  }
}

export default IndexRoute
