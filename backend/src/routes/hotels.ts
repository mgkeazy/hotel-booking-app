import express ,{Request,Response, response} from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";
import { ParsedQs } from "qs";


const router = express.Router();

const bodyParser = require("body-parser");

// router.use(bodyParser.json());
//api/hotels/search
router.get("/search",async(req:Request,res:Response)=>{
    try{
        const pageSize=5;
        
        const query=constructSearchQuery(req.query);

        let sortOptions = {};
        switch(req.query.sortOption){
            case "starRating":
                sortOptions={ starRating: -1 };
                break;
            
            case "pricePerNightAsc":
                sortOptions={ pricePerNight: 1 };
                break;

            case "pricePerNightDesc":
                sortOptions={ pricePerNight: -1 };
                break;
        }

        const pageNumber = parseInt(req.query.page ? req.query.page.toString():"1");
        
        const skip=(pageNumber-1)*pageSize;

        const hotels = await Hotel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse ={
            data: hotels,
            pagination:{
                total,
                page:pageNumber,
                pages:Math.ceil(total/pageSize),
            }
        };
        // console.log(req.query.destination);
        res.json(response);

    }catch(error){
        console.log("error",error);
        res.status(500).json({message:"Something went wrong"});
    }
})

export default router;

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
  
    if (queryParams.destination) {
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ];
    }
  
    if (queryParams.adultCount) {
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      };
    }
  
    if (queryParams.childCount) {
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      };
    }

    if(queryParams.facilities){
        constructedQuery.facilities={
            $all: Array.isArray(queryParams.facilities) 
            ? queryParams.facilities
            :[queryParams.facilities]
        }
    }

    if(queryParams.types){
        constructedQuery.type={
            $in: Array.isArray(queryParams.types) 
            ? queryParams.types 
            : [queryParams.types]
        }
    }

    if(queryParams.stars){
        const starRating = Array.isArray(queryParams.stars) 
        ? queryParams.stars.map((star: string)=> parseInt(star))
        : parseInt(queryParams.stars);

        constructedQuery.starRating={ $eq: starRating }
    }

    if(queryParams.maxPrice){
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        }
    }
  
    return constructedQuery;
  };