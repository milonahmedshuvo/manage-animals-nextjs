'use client'
import ModalAnimal from "@/components/createAnimal/page";
import ModalCategory from "@/components/createCategory/page";
import Image from "next/image";
import { useEffect, useState } from "react";

export type TCategory = {
  _id: string 
  name: string,
 }

export type TAnimal = {
  _id: string,
  name: string,
  image: string,
  category: string
}

type ApiResponse<T> = {
  success: boolean;
  message: string
  data: T;
};


const Home = () => {
  const [categorys, setCategory] = useState<TCategory[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [animals, setAnimal] = useState<TAnimal[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [animalLoading, setAnimalLoading] = useState(true);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch('https://animal-backend-liart.vercel.app/api/v1/category/all');

        const data: ApiResponse<TCategory[]> = await res.json();
        setCategory(data?.data);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();

  }, []);




  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    const fetchAnimalData = async () => {
      try {
        const res = await fetch('https://animal-backend-liart.vercel.app/api/v1/animal/all');

        const data:ApiResponse<TAnimal[]> = await res.json();
        setAnimal(data?.data);
      } catch (err) {
        console.log(err)
      } finally {
        setAnimalLoading(false);
      }
    };

    fetchAnimalData();
  }, []);

  const handleCategory = (category:string) => {

    // console.log(category)

      const fetchCategoryData = async () => {
        try {
          const res = await fetch(`https://animal-backend-liart.vercel.app/api/v1/animal/all?category=${category}`);
  
          const data = await res.json();
          setAnimal(data?.data);
        } catch (err) {
         console.log(err)
        } finally {
          setAnimalLoading(false);
        }
      };
  
      fetchCategoryData();
   
  
  }



  return (
    <div className="bg-black h-screen px-4 md:px-10" >

      <section className="flex flex-col md:flex-row justify-between items-center pt-16">

        <div className=" flex items-center gap-4 ">
          {
            categorys?.map((category: { name: string, _id: string }, ) => <div key={category._id} >

              <button onClick={()=> handleCategory(category.name)} className="bg-black  border border-[#EF0D0D]  text-md text-[#EF0D0D] px-6 py-2 rounded-3xl transition focus:text-[#058F34] focus:border-[#058F34]"  >
                {category.name}
              </button>

            </div>)
          }
        </div>


        
        <div className="flex gap-3 ">
          <ModalAnimal setAnimal={setAnimal}  ></ModalAnimal>
          <ModalCategory setCategory={setCategory} ></ModalCategory>
        </div>


      </section>



      {/* animals show  */}

       <div className="mt-20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6   pb-10 ">

           {
             animals?.map((animal:TAnimal) => <div key={animal._id} >
                    
                     <div className="w-[160px] h-[191px] rounded-md border border-[#141414] flex justify-center items-center bg-[#050505]">
                     <Image
                     src={animal.image}
                     width={100}
                     height={100}
                     alt="animal"
                     />
                     </div>

                     <p className="text-white uppercase text-[18px] text-center mt-1">{animal.name}</p>
                     
             </div>)
           }
       </div>

    </div>
  );
}



export default Home 
