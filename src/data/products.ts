import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Bolo de Chocolate',
    price: 45.90,
    description: 'Delicioso bolo de chocolate com cobertura de ganache e recheio cremoso.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 1,
    stock: 10,
    active: true
  },
  {
    id: 2,
    name: 'Bolo Red Velvet',
    price: 55.90,
    description: 'Clássico bolo Red Velvet com cobertura de cream cheese e decoração elegante.',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324626f9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 2,
    stock: 8,
    active: true
  },
  {
    id: 3,
    name: 'Bolo de Cenoura',
    price: 39.90,
    description: 'Tradicional bolo de cenoura brasileiro com cobertura de chocolate.',
    image: 'https://images.unsplash.com/photo-1594054129719-ab94d633a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 1,
    stock: 15,
    active: true
  },
  {
    id: 4,
    name: 'Cheesecake',
    price: 59.90,
    description: 'Cheesecake cremoso com calda de frutas vermelhas.',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 3,
    stock: 12,
    active: true
  },
  {
    id: 5,
    name: 'Bolo de Coco',
    price: 42.90,
    description: 'Bolo de coco fofo com cobertura de coco ralado e doce de leite.',
    image: 'https://images.unsplash.com/photo-1614707585284-9cb9fc018387?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 1,
    stock: 7,
    active: true
  },
  {
    id: 6,
    name: 'Bolo de Morango',
    price: 49.90,
    description: 'Bolo recheado com creme e morangos frescos.',
    image: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    categoryId: 2,
    stock: 9,
    active: true
  },
]; 