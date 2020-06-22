import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    // TODO
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('The specified customer does not exists');
    }

    const productsIds = products.map(product => ({ id: product.id }));

    const productsFound = await this.productsRepository.findAllById(
      productsIds,
    );

    if (productsFound.length !== products.length) {
      throw new AppError('Product not found');
    }

    const errors: string[] = [];
    const toUpdateQuantityProducts: IProduct[] = [];

    const parsedProducts = productsFound.map(productFound => {
      const requiredProduct = products.filter(
        prod => prod.id === productFound.id,
      );

      if (requiredProduct[0].quantity > productFound.quantity) {
        errors.push(`${productFound.name}`);
      }

      toUpdateQuantityProducts.push({
        id: productFound.id,
        quantity: productFound.quantity - requiredProduct[0].quantity,
      });

      return {
        product_id: productFound.id,
        price: productFound.price,
        quantity: requiredProduct[0].quantity,
      };
    });

    if (errors.length !== 0) {
      const error = errors.join(', ');
      const errorMessage = `Insuficient products in stock: ${error}.`;
      throw new AppError(errorMessage);
    }

    await this.productsRepository.updateQuantity(toUpdateQuantityProducts);

    const order = await this.ordersRepository.create({
      customer,
      products: parsedProducts,
    });

    return order;
  }
}

export default CreateOrderService;
