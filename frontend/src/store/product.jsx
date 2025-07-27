import { create } from 'zustand'


const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const useProductStore= create((set) =>(
   


    {
      products: [],
      setProducts: (products) =>set({products})  ,
      createProduct: async(newProduct) =>{
        if(!newProduct.name || !newProduct.image || !newProduct.price){
            return {success: false, message: "Please fill in all fields."}
        }

        const res= await fetch(`${baseUrl}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"

            },
            body:JSON.stringify(newProduct)
        })
        const data = await res.json();
        set((state) =>({products: [...state.products, data.data]}))
        return  {success: true, message: "Product created successfully"}
      },
      fetchProducts: async()=>{
        const res= await fetch(`${baseUrl}/api/products`);
        const data=await res.json();
        set({products: data.data});
      },
      deleteProduct : async (pid)=>{
        const res= await fetch(`${baseUrl}/api/products/${pid}`,{
          method: "DELETE",
        });
        const data=await res.json();
        if(!data.success) 
          return {success: false, message: data.message};

        set(state =>({products: state.products.filter(product=>product._id !==pid)}));
        return {success: true, message: data.message2}
      },
      updateProduct: async (pid, updatedProduct)=>{
        const res= await fetch(`${baseUrl}/api/products/${pid}`,{
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",

          },
          body: JSON.stringify(updatedProduct),
        });
        const data= await res.json();
        if(!data.success)
          return {success: false, message: data.message};
        //update the ui immediatly , without needing a refresh
        set(state =>({
          products: state.products.map(product=>product._id===pid? data.data: product)
        }));
      }
    }
))


