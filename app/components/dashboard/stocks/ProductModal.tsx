import React, { useState, useEffect } from 'react';
import * as Yup from "yup";
import Modal from '../../core/ui/Modal';
import Form from '../../core/ui/form';
import Input from '../../core/ui/input';
import SelectInput from '../../core/ui/SelectInput';
import Button from '../../core/ui/button';
import MultiImageUpload from '../../core/ui/MultiImageUpload';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { showToast } from '../../core/ui/toast';
import { GET_ALL_CATEGORIES } from '@/app/sudo/dashboard/stocks/categories/page';
import { GET_ALL_PRODUCTS } from '@/app/sudo/dashboard/stocks/products/page';
import { Product } from './ProductsTable';

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      code
      success
      message
      data {
        id
        name
        description
        images
        category {
          id
          name
        }
        price
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductInput!, $id: ID!) {
    updateProduct(input: $input, id: $id) {
      code
      success
      message
      data {
        id
        name
        description
        images
        category {
          id
          name
        }
        price
      }
    }
  }
`;

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  mode?: 'create' | 'edit' | 'view';
}

interface CreateProductResponse {
  createProduct: {
    code: number;
    success: boolean;
    message: string;
    data: Product;
  };
}

interface UpdateProductResponse {
  updateProduct: {
    code: number;
    success: boolean;
    message: string;
    data: Product;
  };
}

interface GetAllCategoriesResponse {
  getAllCategories: {
    code: number;
    success: boolean;
    message: string;
    data: { id: string; name: string }[];
  };
}

const ProductModal = ({
  isOpen,
  onClose,
  product = null,
  mode = 'create',
}: ProductModalProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);

  
  useEffect(() => {
    setImageUrls(product?.images || []);
  }, [product]);

  const productValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Product name is required")
      .min(3, "Product name must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    category: Yup.string().required("Category is required"),
    price: Yup.string()
      .required("Price is required")
      .matches(/^\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  });

  const [createProduct, { loading: createLoading }] = useMutation<CreateProductResponse>(CREATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.createProduct.success) {
        showToast('Product created successfully', 'success');
        onClose();
      } else {
        showToast(data.createProduct.message, 'error');
      }
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, 'error');
    },
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const [updateProduct, { loading: updateLoading }] = useMutation<UpdateProductResponse>(UPDATE_PRODUCT, {
    onCompleted: (data) => {
      if (data.updateProduct.success) {
        showToast('Product updated successfully', 'success');
        onClose();
      } else {
        showToast(data.updateProduct.message, 'error');
      }
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, 'error');
    },
    refetchQueries: [{ query: GET_ALL_PRODUCTS }],
  });

  const { data: categoriesData } = useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);
  const categoriesList = categoriesData?.getAllCategories?.data || [];

  const loading = createLoading || updateLoading;
  const isViewMode = mode === 'view';

  const getTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Product';
      case 'view':
        return 'View Product';
      default:
        return 'Create New Product';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'edit':
        return 'Update the product details';
      case 'view':
        return 'View product information';
      default:
        return 'Add a new product to your inventory';
    }
  };

  return (
    <Modal
      title={getTitle()}
      description={getDescription()}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      footer={
        !isViewMode && (
          <Button
            label={loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Product' : 'Create Product')}
            primary
            type="submit"
            onClick={() => {
              document.querySelector('form')?.dispatchEvent(
                new Event('submit', { cancelable: true, bubbles: true })
              );
            }}
          />
        )
      }
    >
      <Form
        validationSchema={productValidationSchema}
        initialValues={{
          name: product?.name || '',
          description: product?.description || '',
          category: product?.category?.id || '',
          price: product?.price || '',
        }}
        onSubmit={(values) => {
          if (imageUrls.length === 0) {
            showToast('Please add at least one image', 'error');
            return;
          }

          const input = {
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            images: imageUrls,
          };

          if (mode === 'edit' && product) {
            updateProduct({
              variables: {
                input,
                id: product.id,
              },
            });
          } else {
            createProduct({
              variables: {
                input,
              },
            });
          }
        }}
        className="w-full"
      >
        {(formik) => (
          <div className="w-full flex flex-col gap-4">
            <Input
              label="Product Name"
              name="name"
              placeholder="Enter product name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              required
              disabled={isViewMode}
            />

            <Input
              label="Description"
              name="description"
              placeholder="Enter product description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
              required
              disabled={isViewMode}
            />

            <SelectInput
              label="Category"
              name="category"
              placeholder="Select category"
              value={formik.values.category}
              onChange={(value) => formik.setFieldValue('category', value)}
              options={categoriesList.map((category: { id: string; name: string }) => ({
                id: category.id,
                label: category.name,
                value: category.id,
              }))}
            />

            <Input
              label="Price"
              name="price"
              placeholder="Enter price (e.g., 29.99)"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price ? formik.errors.price : undefined}
              required
              disabled={isViewMode}
            />

            <MultiImageUpload
              label="Product Images"
              required
              images={imageUrls}
              onChange={setImageUrls}
              disabled={isViewMode}
              maxSize={5}
              columns={4}
              onError={(message) => showToast(message, 'error')}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default ProductModal;
