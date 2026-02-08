import React from 'react';
import * as Yup from "yup";
import Modal from '../../core/ui/Modal';
import Form from '../../core/ui/form';
import Input from '../../core/ui/input';
import SelectInput from '../../core/ui/SelectInput';
import Button from '../../core/ui/button';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { showToast } from '../../core/ui/toast';
import { GET_ALL_PRODUCTS, GET_ALL_INVENTORY } from '@/app/apollo/queries';
import { InventoryItem } from './InventoryTable';

const CREATE_INVENTORY = gql`
  mutation CreateInventory($input: InventoryInput!) {
    createInventory(input: $input) {
      code
      success
      message
    }
  }
`;

const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($id: ID!, $input: InventoryUpdateInput!) {
    updateInventory(id: $id, input: $input) {
      code
      success
      message
    }
  }
`;

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory?: InventoryItem | null;
  mode?: 'create' | 'edit' | 'view';
}

interface GetAllProductsResponse {
  getAllProducts: {
    data: { id: string; name: string; images: string[] }[];
  };
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

const InventoryModal = ({
  isOpen,
  onClose,
  inventory = null,
  mode = 'create',
}: InventoryModalProps) => {
  const validationSchema = Yup.object().shape({
    product: Yup.string().required("Product is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(0, "Quantity cannot be negative")
      .integer("Quantity must be a whole number"),
    sizes: Yup.array()
      .of(Yup.string())
      .min(1, "At least one size is required"),
  });

  const [createInventory, { loading: createLoading }] = useMutation(CREATE_INVENTORY, {
    onCompleted: (responseData) => {
      const data = responseData as { createInventory: { success: boolean; message: string } };
      if (data.createInventory.success) {
        showToast('Inventory created successfully', 'success');
        onClose();
      } else {
        showToast(data.createInventory.message, 'error');
      }
    },
    onError: (error) => showToast(error.message, 'error'),
    refetchQueries: [{ query: GET_ALL_INVENTORY }],
  });

  const [updateInventory, { loading: updateLoading }] = useMutation(UPDATE_INVENTORY, {
    onCompleted: (responseData) => {
      const data = responseData as { updateInventory: { success: boolean; message: string } };
      if (data.updateInventory.success) {
        showToast('Inventory updated successfully', 'success');
        onClose();
      } else {
        showToast(data.updateInventory.message, 'error');
      }
    },
    onError: (error) => showToast(error.message, 'error'),
    refetchQueries: [{ query: GET_ALL_INVENTORY }],
  });

  const { data: productsData } = useQuery<GetAllProductsResponse>(GET_ALL_PRODUCTS);
  const productsList = productsData?.getAllProducts?.data || [];

  const loading = createLoading || updateLoading;
  const isViewMode = mode === 'view';

  const getTitle = () => {
    switch (mode) {
      case 'edit': return 'Edit Inventory';
      case 'view': return 'View Inventory';
      default: return 'Add Inventory';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'edit': return 'Update inventory details';
      case 'view': return 'View inventory information';
      default: return 'Add stock for a product';
    }
  };

  return (
    <Modal
      title={getTitle()}
      description={getDescription()}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      footer={
        !isViewMode && (
          <Button
            label={loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update' : 'Create')}
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
        initialValues={{
          product: inventory?.product?.id || '',
          quantity: inventory?.quantity || 0,
          sizes: inventory?.sizes || [],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const input = {
            product: values.product,
            sizes: values.sizes,
            quantity: parseInt(String(values.quantity)),
          };

          if (mode === 'edit' && inventory) {
            await updateInventory({
              variables: { id: inventory.id, input: { sizes: input.sizes, quantity: input.quantity } }
            });
          } else {
            await createInventory({ variables: { input } });
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <div className="space-y-4">
            <SelectInput
              name="product"
              label="Product"
              placeholder="Select a product"
              value={values.product}
              onChange={(value) => setFieldValue('product', value)}
              options={productsList.map((p) => ({ id: p.id, label: p.name, value: p.id }))}
              required
            />

            <Input
              type="number"
              label="Quantity"
              name="quantity"
              placeholder="Enter quantity"
              value={String(values.quantity)}
              onChange={(e) => setFieldValue('quantity', e.target.value)}
              disabled={isViewMode}
              required
            />

            <div className="flex flex-col gap-2">
              <span className="text-sm text-black font-medium">
                Available Sizes <span className="text-rose-800">*</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SIZES.map((size) => {
                  const isSelected = values.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isViewMode}
                      onClick={() => {
                        const newSizes = isSelected
                          ? values.sizes.filter((s: string) => s !== size)
                          : [...values.sizes, size];
                        setFieldValue('sizes', newSizes);
                      }}
                      className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                        isSelected
                          ? 'bg-rose-800 text-white border-rose-800'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-rose-800'
                      } ${isViewMode ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default InventoryModal;
