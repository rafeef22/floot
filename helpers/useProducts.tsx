import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  InputType as GetProductsInput,
} from "../endpoints/products_GET.schema";
import {
  getProduct,
  InputType as GetProductInput,
} from "../endpoints/product_GET.schema";
import { postAdminProducts, InputType as CreateProductInput } from "../endpoints/admin/products_POST.schema";
import { postAdminProductUpdate, InputType as UpdateProductInput } from "../endpoints/admin/product/update_POST.schema";
import { postAdminProductDelete, InputType as DeleteProductInput } from "../endpoints/admin/product/delete_POST.schema";

export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (filters: GetProductsInput) =>
    [...productsQueryKeys.lists(), filters] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productsQueryKeys.details(), id] as const,
};

export const useProducts = (filters: GetProductsInput = {}) => {
  return useQuery({
    queryKey: productsQueryKeys.list(filters),
    queryFn: () => getProducts(filters),
  });
};

export const useProduct = (id: number | null) => {
  return useQuery({
    queryKey: productsQueryKeys.detail(id!),
    queryFn: () => getProduct({ id: id! }),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProduct: CreateProductInput) => postAdminProducts(newProduct),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProduct: UpdateProductInput) => postAdminProductUpdate(updatedProduct),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
            queryClient.setQueryData(productsQueryKeys.detail(data.product.id), data);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (toDelete: DeleteProductInput) => postAdminProductDelete(toDelete),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() });
            queryClient.removeQueries({ queryKey: productsQueryKeys.detail(variables.id) });
        },
    });
};