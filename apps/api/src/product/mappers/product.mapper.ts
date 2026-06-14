export class ProductMapper {
  static toResponse<T>(product: T): T {
    return product;
  }

  static toResponseList<T>(products: T[]): T[] {
    return products;
  }
}
