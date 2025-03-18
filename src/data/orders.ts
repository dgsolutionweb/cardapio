import { Order } from '../types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: 1,
    customerName: 'Maria Silva',
    customerPhone: '11999887766',
    customerAddress: 'Rua das Flores, 123 - São Paulo, SP',
    items: [
      {
        product: products[0],
        quantity: 2
      },
      {
        product: products[3],
        quantity: 1
      }
    ],
    total: (products[0].price * 2) + products[3].price,
    status: 'confirmed',
    createdAt: new Date(2023, 9, 15, 14, 30),
    updatedAt: new Date(2023, 9, 15, 14, 45)
  },
  {
    id: 2,
    customerName: 'João Pereira',
    customerPhone: '11988776655',
    customerAddress: 'Avenida Paulista, 1500, Apto 302 - São Paulo, SP',
    items: [
      {
        product: products[1],
        quantity: 1
      },
      {
        product: products[4],
        quantity: 1
      }
    ],
    total: products[1].price + products[4].price,
    status: 'delivered',
    createdAt: new Date(2023, 9, 14, 10, 15),
    updatedAt: new Date(2023, 9, 14, 14, 20)
  },
  {
    id: 3,
    customerName: 'Ana Oliveira',
    customerPhone: '11977665544',
    customerAddress: 'Rua Augusta, 500 - São Paulo, SP',
    items: [
      {
        product: products[2],
        quantity: 3
      }
    ],
    total: products[2].price * 3,
    status: 'pending',
    createdAt: new Date(2023, 9, 16, 9, 10),
    updatedAt: new Date(2023, 9, 16, 9, 10)
  },
  {
    id: 4,
    customerName: 'Carlos Santos',
    customerPhone: '11966554433',
    customerAddress: 'Rua dos Pinheiros, 100 - São Paulo, SP',
    items: [
      {
        product: products[5],
        quantity: 2
      },
      {
        product: products[0],
        quantity: 1
      },
      {
        product: products[3],
        quantity: 1
      }
    ],
    total: (products[5].price * 2) + products[0].price + products[3].price,
    status: 'cancelled',
    createdAt: new Date(2023, 9, 13, 16, 45),
    updatedAt: new Date(2023, 9, 13, 17, 30)
  }
]; 