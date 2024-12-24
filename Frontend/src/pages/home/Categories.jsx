import React from 'react'
import category1 from "../../assets/category-1.png"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories = [
        {name: 'TABLEWARE', path: 'tableware', image: category1},
        {name: 'HOME DECOR', path: 'homedecor', image: category2},
        {name: 'HOLIDAY', path: 'holiday', image: category3},
        {name: 'DINNERWARE', path: 'dinnerware', image: category4}
    ]
  return (
    <>
    <div className='product__grid'>
        {
            categories.map((category) => (
                <Link to = { `/categories/${category.path}`}>
                    <img src={category.image} alt={category.name} />
                    <h4>{category.name}</h4>
                </Link>
            ))
        }
    </div>
    
    </>
  )
}

export default Categories
