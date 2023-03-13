import React, { useEffect, useState } from "react";
import UserOrderService from '../services/userorder.service';
import {Modal , ModalHeader ,ModalBody } from "reactstrap";
import Orderstatus from "../models/orderStatus";
import store from '../redux/store';
import {  toast } from 'react-toastify';


const MyOrders = () => {

  const currentUser = store.getState().user; 
  const [model,setModel]=useState(false);
  const [orders, setOrders] = useState([]);
  const [orderId , setOrderId] = useState(0);
  const [reRender ,setReRender]=useState(false)
  const BASE_URL = "http://localhost:8080/products/";

  useEffect(() => {
    UserOrderService.getMyOrders(currentUser.id).then((resp) => {
      setOrders(resp.data);
    }).then(()=>{
      console.log(orders)
    })
  }, [reRender])

  const handleStatusChange=(e)=>{
        // const{name , value}= e.target
        // setOrderStat(prevStat =>{
        //   return {
        //     ...prevStat,
        //     [name]:value
        //   }
        // })
        // console.log(orderStat)
        setOrderId(e.target.value);

  }

  const handleStatusUpdateSubmit =(e)=>{
    UserOrderService.cancelMyOrder(orderId).then((resp)=>{
      toast.success("Order Cancelled" ,{autoClose: 1500});
      setReRender(true)
     })
  }

  // const cancelOrder =(id)=>{
  //   console.log("In Cancel  "+id);
  //   // if(window.confirm("Confirm Canceled")){
      // UserOrderService.cancelMyOrder(id).then(()=>{
      //   alert("Order Canceled");
      //   // setReRender(true);
      //  })
    
    
  // }



  return (
    <>
    {/* Code For Updating The Order Status */}
     <div className="form-control">
      <button  className="btn btn-outline-dark m-2" onClick={()=>{setModel(true)}}> Cancel Order</button>
     <small>please copy Order Id First</small>

      <div>
        <Modal
        size="lg"
        isOpen={model}
        toggle={()=>setModel(!model)}
        style={{backgroundColor:"green"}}
        >
           <ModalHeader toggle={()=>setModel(!model)}>
           Cancel Order
           </ModalHeader>
           <ModalBody>
            <form onSubmit={(e)=>{handleStatusUpdateSubmit(e)}}>

                    <div class="form my-3">
                      <label htmlFor="orderid">
                        Order ID
                      </label>
                     <input 
                     type="text" 
                     id="orderId"
                     name="orderId"
                     className="form-control" 
                     onChange={handleStatusChange}
                     placeholder="Enter Order ID To be Updated"/>
                    </div>

                    <div className="text-center">
                          <button class="my-2 mx-auto btn btn-dark" type="submit" >
                                 Cancel Order
                          </button>
                    </div>
            </form>
           </ModalBody>
        </Modal>
      </div>





     </div>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Order Id</th>
            <th scope="col">Product</th>
            <th scope="col">Name</th>
            <th scope="col">description</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total Price</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Address</th>
            <th scope="col">City</th>
            <th scope="col">Pin Code</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Status</th>
            <th scope="col">Order date</th>
            <th scope="col">Delivery Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>

          {/* // {
//     "orderDate": "2023-03-12",
//     "deliveryDate": "2024-12-12",
//     "status": "PLACED",
//     "totalPrice": 409.0,
//     "shippingPrice": 40.0,
//     "userOrdered": 3,
//     "address": 2
// } */}


          {
            orders.map((order) => {
              return (
                <>
                  {
                    order.orderDetails.map((oDetails) => {
                      return (
                        <>
                          <tr>
                            <td >{order.id}</td>
                            <td >
                                <img
                                  src={BASE_URL + oDetails.productId.id + '/image'}
                                  width={100}
                                  height={75}
                                  alt={oDetails.productId.name}
                                />
                            </td>
                            <td >{oDetails.productId.name}</td>
                            <td >{oDetails.productId.description}</td>
                            <td >{oDetails.quantity}</td>
                            <td >{oDetails.totalPrice + order.shippingPrice}</td>
                            <td >{order.userOrdered.firstName + " " + order.userOrdered.lastName}</td>
                            <td >{
                              order.address.adressLine1 + " " +
                              order.address.adressLine2
                            }</td>
                            <td >{order.address.city}</td>
                            <td >{order.address.zipCode}</td>
                            <td >{order.userOrdered.mobileNumber}</td>
                            <td >{order.status}</td>
                            <td >{order.orderDate}</td>
                            <td >{order.deliveryDate}</td>
     

                          </tr>
                        </>
                      );
                    })
                  }
                </>
              )
            })
          }
        </tbody>
      </table>

    </>


  );


}

export default MyOrders;