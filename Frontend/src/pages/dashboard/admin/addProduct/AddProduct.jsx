import React from 'react'
import { useSelector } from 'react-redux';

const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Tableware', value: 'tableware' },
    { label: 'Dinnerware', value: 'dinnerware' },
    { label: 'Home Decor', value: 'homedecor' },
    { label: 'Holiday', value: 'holiday' }
];

const colors = [
    { label: 'Select Color', value: '' },
    { label: 'Black', value: 'black' },
    { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' },
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        description: ''
    });
    const [image, setImage] = useState('');

    const [AddProduct, {isLoading, error}] = useAddProductMutation()
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });


    };

    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!product.name || !product.category || !product.price || !product.description || !product.color) {
            alert('Please fill all the required fields');
            return;
        }

        try {
            await AddProduct({...product, image, author: user?._id}).unwrap();
            alert('Product added successfully');
            setProduct({ name: '',
                category: '',
                color: '',
                price: '',
                description: ''})
                setImage('');
                navigate("/shop")
        } catch (error) {
            console.log("Failed to submit product", error);
        }
    }

  return (
    <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4"></form>
    </div>
  )
}

export default AddProduct
