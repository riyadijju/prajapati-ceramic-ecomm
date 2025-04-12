import React from 'react'
import category1 from "../../assets/category-1.png"
import category2 from "../../assets/category-2.png"
import category3 from "../../assets/category-3.png"
import category4 from "../../assets/category-4.png"
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories = [
        {name: 'TABLEWARE', path: 'tableware', image: category1},
        {name: 'HOME DECOR', path: 'homedecor', image: category2},
        {name: 'HOLIDAY', path: 'holiday', image: category3},
        {name: 'DINNERWARE', path: 'dinnerware', image: category4}
    ]
  return <div className='size-[400px] w-[80%] bottom-[-20px] left-1/2 -translate-x-1/2 absolute bg-white z-20 flex  justify-between p-[4.5rem] rounded-tl-[40px] rounded-tr-[40px]'>
    
        {
            categories.map((category) => (
                <Link key={category.name} to={`/categories/${category.path}`} className=' z-50 flex flex-col items-center gap-2'>
                    <img className='size-full object-cover object-center' src={category.image} alt={category.name} />
                    <h4>{category.name}</h4>
                </Link>
            ))
        }
    
  </div>

    

  
    
    
    
    
  
}

export default Categories
