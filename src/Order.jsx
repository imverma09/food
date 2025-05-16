import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
 const api = "https://food-1-8pg1.onrender.com"
function Order() {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
        fetchOrders() ;
  } ,[])
  const deleteOrder = async (_id) => {
    try {
      const response = await axios.delete(
        `${api}/api/order/${_id}`
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setOrders(orders.filter((val) => val._id !== _id));
  };
  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${api}/api/todayOrders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  return (
    <div>
      <div className="bg-black text-white min-h-screen p-4">
        <div className="flex justify-around">
        <h2 className="text-xl mb-4">Today Orders</h2>
        <h2 className="text-xl mb-4"><Link to={'/'}>Main Page</Link></h2>
        </div>
            
        {orders.map((order) => (
          <div key={order._id} className="mb-4 bg-gray-900 p-4 rounded ">
            <div className="text-right">
              <button
                className="text-red-400 text-3xl cursor-pointer"
                onClick={() => {
                  deleteOrder(order._id);
                }}
              >
                <Trash2></Trash2>
              </button>
            </div>
            <div className="flex justify-between mb-2">
              <h3 className="text-lg">Order ID : #{order._id.substr(-6)}</h3>
              <span className="text-gray-400">
                {new Date(order.orderDate).toLocaleString()}
              </span>
            </div>
            <p className="mb-2 text-yellow-500">
              Customer : {order.customerName}
            </p>
            <table className="w-full mb-2">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">₹{item.price}</td>
                    <td className="p-2 text-right">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="p-2" colSpan="3">
                    Total Amount:
                  </td>
                  <td className="p-2 text-right">₹{order.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-center p-4 bg-gray-900 rounded">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Order;
