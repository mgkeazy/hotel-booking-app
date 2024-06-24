import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from  "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import {UseAppContext} from "../contexts/AppContext";
// import { shouldProcessLinkClick } from "react-router-dom/dist/dom";


const EditHotel = ()=>{
    const { hotelId } = useParams();
    const { showToast } = UseAppContext();

    const { data:hotel } = useQuery("fetchMyHotelById",()=>apiClient.fetchMyHotelById(hotelId || ''),{
        enabled: !!hotelId,
    });


    const {mutate,isLoading} = useMutation(apiClient.updateMyHotelById,{
        onSuccess:()=>{
            showToast({message:"Hotel Saved!", type:"SUCCESS"});
        },
        onError:()=>{
            showToast({message:"Error Saving Hotel", type:"ERROR"});
        }
    });

    const handleSave = async (hotelFormData: FormData)=>{
        mutate(hotelFormData);
    }

    return <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
}

export default EditHotel;