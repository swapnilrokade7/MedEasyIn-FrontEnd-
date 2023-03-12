import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import ProductService from '../services/product.service';
import CategoryService from '../services/category.service';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CartItem from '../models/item';
import CartService from "../services/cart.service";
import Category from "../models/category";
import store from '../redux/store';
import {  useNavigate } from "react-router-dom";



const Products = () => {
  const navigate = useNavigate();

  const currentUser = store.getState().user;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [categorie, setCategorie] = useState([]);
  let componentMounted = true;
  const BASE_URL="http://localhost:8080/products/";

  const dispatch = useDispatch();

  const addProduct = (product) => {
    // dispatch(addCart(product))
    if(!currentUser){
      alert("You should Login First");
      navigate('/login')
      return;
    }
    const item=new CartItem(1,currentUser.id,product.id);
    CartService.addToCart(item).then((resp)=>{
      console.log("Item is Added");
    });

    



    alert("Product is Added In Cart");
  }


  //Fetched Data From Backend
  useEffect(() => {
    
    ProductService.getAllProducts().then((response) => {
      setData(response.data);
      setFilter(response.data);
      setLoading(false);
    });

    CategoryService.getAllCategories().then((response) => {
      setCategorie(response.data);
    });

    // const getProducts = async () => {
    //   setLoading(true);
    //   const response = await fetch("https://fakestoreapi.com/products/");
    //   if (componentMounted) {
    //     setData(await response.clone().json());
    //     setFilter(await response.json());
    //     setLoading(false);
    //   }

    //   return () => {
    //     componentMounted = false;
    //   };
    // };

    // getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };


  const filterProduct = (id) => {

    // const updatedList = data.filter((item) => item.category === cat);
    ProductService.getProductsByCategory(id).then((response)=>{
      setFilter(response.data)
    });
    // setFilter(updatedList);
  }


  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(data)}>All</button>
          {categorie.map((cat)=>{
            const name=cat.categoryName;
            console.log(BASE_URL + cat.id );
            return <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct(cat.id)}>{cat.categoryName}</button>
          })}

        </div>
        
        {filter.map((product) => {
          return (
            <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={BASE_URL + product.id + '/image'}//src={product.image}
                  
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {/* {product.title.substring(0, 12)}...  */}
                    {product.name.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">Rs. {product.price}</li>
                  {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                </ul>
                <div className="card-body">
                  {/* <Link to={"/product/" + product.id} className="btn btn-dark m-1">
                    Buy Now
                  </Link> */}
                  <button className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
