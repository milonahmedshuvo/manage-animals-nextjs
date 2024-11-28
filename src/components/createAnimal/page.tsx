/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { TAnimal } from "@/app/page";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast";

type Inputs = {
    name: string
    image: string
    category: string
}
type TCategory = {
    _id: string 
    name: string,
   }

   type ApiResponse<T> = {
    success: boolean;
    message: string
    data: T;
  };

// { setAnimal }
type ModalAnimalProps = {
    setAnimal: React.Dispatch<React.SetStateAction<TAnimal[]  >>;
  };


export default function ModalAnimal( { setAnimal}:ModalAnimalProps  ) {
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, reset } = useForm<Inputs>()

    const [categorys, setCategory] = useState<TCategory[] | null>(null);
    const [loading, setLoading] = useState(true);
   
    
  
  
  
  
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
  
      const fetchCategoryData = async () => {
        try {
          const res = await fetch('https://animal-backend-liart.vercel.app/api/v1/category/all');
  
          const data:ApiResponse<TCategory[]> = await res.json();
          setCategory(data.data);
        } catch (err) {
          console.log(err)
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategoryData();
    }, []);
  



    // start add animal 

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data)


        const formData = new FormData();
        formData.append('image', data.image[0]);


    try{
        const response = await axios.post('https://api.imgbb.com/1/upload?&key=1e1cb35e45fc37d4bfe6bd8a3ed195cc', formData, {
            params: { key: '1e1cb35e45fc37d4bfe6bd8a3ed195cc'},
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        })

         
         const animalData = {
            name: data.name,
            image: response.data.data.url,
            category: data.category  
           }


           const res = await fetch('https://animal-backend-liart.vercel.app/api/v1/animal/create', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(animalData)
           })

           const animal = await res.json()


        //    console.log('animal response', animal)
           if(animal.success){
            toast.success('animal create succesfully!')

            console.log('animal post:', animal)
            setAnimal((prevsData) => [...prevsData, animal?.data])
            setShowModal(false)
            // location.reload()
           }







        // console.log("image upload success:", response.data.data.url)
        
       
        reset()
    } catch(err){
        console.log("error uploading image", err)
    }

    }














    return (
        <div className="flex justify-center ">
            
            <button
                className="bg-black border  text-md text-white px-6 py-2 rounded-3xl transition "
                onClick={() => setShowModal(true)}
            >
                Add Animal
            </button>




            {/* Modal */}
            {showModal ? (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add Animal</h2>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>





                       
                        <div>

                            <form onSubmit={handleSubmit(onSubmit)}>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md mb-4 focus:outline-none"
                                    placeholder="Enter animal name"
                                    {...register('name')}
                                />

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    image
                                </label>
                                <input
                                    type="file"
                                    className="w-full p-2 border rounded-md mb-4"
                                    {...register('image')}
                                />

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Category 
                                </label>

                                <select
                                    className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none mb-4"

                                    {...register('category', { required: true })}
                                >
                                    <option value="" disabled>
                                        -- Select an Category --
                                    </option>
                                    {
                                        categorys?.map((category:{name:string, _id: string}) => <option key={category._id} value={category.name}>{category.name}</option> )
                                    }

                                </select>


                                <button className="bg-black text-white px-4 py-2 rounded w-full transition">
                                    Create Animal
                                </button>

                            </form>
                        </div>


                    </div>
                </div>




            ) : null}
        </div>
    );
}
