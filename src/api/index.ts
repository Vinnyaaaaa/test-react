import { Product } from "./types";

export const getProductList = async () => {
  const response = await fetch("https://fakestoreapi.com/products");

  return response.json() as Promise<Product[]>;
};

export const getProductDetail = async (id: number) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);

  return response.json() as Promise<Product>;
};
