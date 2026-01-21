import React from 'react'
import Header from '../components/Header'
import ProductsCategories from '../components/ProductsCategories'

export default function Home() {

  // dynamic title
  document.title = "Home";

  return (
    <div>
      <Header />
      <ProductsCategories />
    </div>
  )
}
