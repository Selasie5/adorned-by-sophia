import React from 'react';
import * as Yup from "yup";
import Modal from '../../core/ui/Modal';
import Form from '../../core/ui/form';
import Input from '../../core/ui/input';
import SelectInput from '../../core/ui/SelectInput';
import Button from '../../core/ui/button';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { GET_ALL_CATEGORIES } from '@/app/apollo/queries';
import { showToast } from '../../core/ui/toast';
import { Category } from './CategoriesTable';

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      code
      success
      message
      data {
        id
        name
        description
        parentCategory {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      code
      success
      message
      data {
        id
        name
        description
        parentCategory {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  mode?: 'create' | 'edit' | 'view';
}

interface CreateCategoryResponse {
  createCategory: {
    code: number;
    success: boolean;
    message: string;
    data: Category;
  };
}

interface UpdateCategoryResponse {
  updateCategory: {
    code: number;
    success: boolean;
    message: string;
    data: Category;
  };
}

interface GetAllCategoriesResponse {
  getAllCategories: {
    code: number;
    success: boolean;
    message: string;
    data: Category[];
  };
}

const CategoryModal = ({
  isOpen,
  onClose,
  category = null,
  mode = 'create',
}: CategoryModalProps) => {
  const categoryValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters"),
    description: Yup.string().optional(),
    parentCategory: Yup.string().optional().nullable(),
  });

  const [createCategory, { loading: createLoading }] = useMutation<CreateCategoryResponse>(CREATE_CATEGORY, {
    onCompleted: (data) => {
      if (data.createCategory.success) {
        showToast('Category created successfully', 'success');
        onClose();
      } else {
        showToast(data.createCategory.message, 'error');
      }
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, 'error');
    },
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
  });

  const [updateCategory, { loading: updateLoading }] = useMutation<UpdateCategoryResponse>(UPDATE_CATEGORY, {
    onCompleted: (data) => {
      if (data.updateCategory.success) {
        showToast('Category updated successfully', 'success');
        onClose();
      } else {
        showToast(data.updateCategory.message, 'error');
      }
    },
    onError: (error) => {
      console.error(error);
      showToast(error.message, 'error');
    },
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
  });

  const { data: categoriesData } = useQuery<GetAllCategoriesResponse>(GET_ALL_CATEGORIES);
  const categoriesList = categoriesData?.getAllCategories?.data || [];
  
  const parentCategoryOptions = categoriesList
    .filter((cat) => cat.id !== category?.id)
    .map((cat) => ({
      id: cat.id,
      label: cat.name,
      value: cat.id,
    }));

  const loading = createLoading || updateLoading;
  const isViewMode = mode === 'view';

  const getTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Category';
      case 'view':
        return 'View Category';
      default:
        return 'Create New Category';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'edit':
        return 'Update the category details';
      case 'view':
        return 'View category information';
      default:
        return 'Add a new category for grouping your products';
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
            label={loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Category' : 'Create Category')}
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
        validationSchema={categoryValidationSchema}
        initialValues={{
          name: category?.name || '',
          description: category?.description || '',
          parentCategory: category?.parentCategory?.id || '',
        }}
        onSubmit={(values) => {
          const input = {
            name: values.name,
            description: values.description || null,
            parentCategory: values.parentCategory || null,
          };

          if (mode === 'edit' && category) {
            updateCategory({
              variables: {
                id: category.id,
                input,
              },
            });
          } else {
            createCategory({
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
              label="Category Name"
              name="name"
              placeholder="Enter category name"
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
              placeholder="Enter category description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
              disabled={isViewMode}
            />

            <SelectInput
              label="Parent Category"
              name="parentCategory"
              placeholder="Select parent category (optional)"
              value={formik.values.parentCategory}
              onChange={(value) => formik.setFieldValue('parentCategory', value)}
              options={parentCategoryOptions}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CategoryModal;
