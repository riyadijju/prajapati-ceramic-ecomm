import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import products from "../../data/products.json"

const CategoryPage = () => {
    const {categoryName} = useParams();
   const [filteredProducts, setFilteredProducts] = useState([]);

   useEffect(() =>{
    const filtered = products.filter((product) => product.category === categoryName.toLowerCase());

    setFilteredProducts(filtered);
   } , [categoryName])

  return (
    <> 
    <section className='section__container bg-primary-light'>
            <h2 className='section__header capitalize'>{categoryName}</h2>
            <p className='section__subheader'>Browse a diverse range of ceramics, from tableware to versatile home decors. Elevate your space today!</p>
    </section>
    </>
    
  )
}

export default CategoryPage