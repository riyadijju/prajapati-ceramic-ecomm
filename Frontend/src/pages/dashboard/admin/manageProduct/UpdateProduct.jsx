import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

const categories = [
  { label: 'Select Category', value: '' },
  { label: 'Tableware', value: 'tableware' },
  { label: 'Dinnerware', value: 'dinnerware' },
  { label: 'Home Decor', value: 'homedecor' },
  { label: 'Holiday', value: 'holiday' }
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: productData, isLoading, error } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: '',
    variants: [{ name: '', color: '', image: '', price: '', stock: '' }]
  });

  useEffect(() => {
    if (productData?.product) {
      const {
        name,
        category,
        description,
        price,
        image,
        variants
      } = productData.product;

      setProduct({
        name: name || '',
        category: category || '',
        description: description || '',
        price: price || '',
        image: image || '',
        variants: variants?.length > 0
          ? variants.map(v => ({
              _id: v._id || '',
              name: v.name || '',
              color: v.color || '',
              image: v.image || '',
              price: v.price || '',
              stock: v.stock || ''
            }))
          : [{ name: '', color: '', image: '', price: '', stock: '' }]
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleImageChange = (image) => {
    setProduct({ ...product, image });
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...product.variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleVariantImageChange = (index, image) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = { ...updatedVariants[index], image };
    setProduct({ ...product, variants: updatedVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { name: '', color: '', image: '', price: '', stock: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.category || !product.price || !product.description || !product.image) {
      alert('Please fill all the required fields');
      return;
    }

    for (let i = 0; i < product.variants.length; i++) {
      const variant = product.variants[i];
      if (!variant.name || !variant.color || !variant.image || !variant.price || !variant.stock) {
        alert(`Please fill all the required fields for variant ${i + 1}`);
        return;
      }
    }

    try {
      await updateProduct({ id, ...product, author: user?._id }).unwrap();
      alert('Product updated successfully');
      navigate('/dashboard/manage-products');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (isLoading) return <div>Loading product...</div>;
  if (error) return <div>Failed to load product!</div>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Product Name"
          name="name"
          placeholder="Ex: Chapacho Vase A12"
          value={product.name}
          onChange={handleChange}
        />
        <SelectInput
          label="Category"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />
        <TextInput
          label="Price"
          name="price"
          type="number"
          placeholder="2590"
          value={product.price}
          onChange={handleChange}
        />
        <UploadImage
          name="image"
          value={product.image}
          onImageChange={handleImageChange}
          placeholder="Main Image"
        />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            className="add-product-InputCSS"
            value={product.description}
            placeholder="Write a product description"
            onChange={handleChange}
          ></textarea>
        </div>

        <h3 className="text-xl font-semibold mt-6">Variants</h3>
        {product.variants.map((variant, index) => (
          <div key={index} className="space-y-4 border p-4 rounded-xl shadow">
            <TextInput
              label="Variant Name"
              name="name"
              value={variant.name}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextInput
              label="Color (Hex Code)"
              name="color"
              type="text"
              placeholder="#D4AF37"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <UploadImage
              name="image"
              value={variant.image}
              onImageChange={(image) => handleVariantImageChange(index, image)}
              placeholder="Variant Image"
            />
            <TextInput
              label="Price"
              name="price"
              type="number"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextInput
              label="Stock"
              name="stock"
              type="number"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, e)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="text-sm text-[#8B5E3C] hover:underline"
        >
          + Add New Variant
        </button>

        <div>
          <button
            type="submit"
            className="add-product-btn"
          >
            {isUpdating ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
