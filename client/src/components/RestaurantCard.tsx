const RestrauntCard= ({name, cloudinaryImageId, avgRating, deliveryTime, costForTwo}) =>{
    return(
      <div className="p-2 lg:p-4 block justify-between border-2  hover:border-[#d3d5df] hover:shadow-lg hover:shadow-gray-300 hover:scale-105 ease-linear duration-75">
        <img className="w-full" src={cloudinaryImageId}></img>
        <div className="text-base font-bold break-words">{name}</div>
        <div className="text-[#686b78] text-xs mt-1"></div>
        <div className="text-xs flex justify-between pt-2 shadow-md">
            <span className="bg-green-500 text-white rounded-sm p-[1px] px-[2px]" >{avgRating?.$numberDecimal} <span className="text-sm">✩</span></span>
            <div>{deliveryTime} mins</div>
            <div>{costForTwo} for two</div>
        </div>
        <div className="flex border-t-white border-t-solid mt-2 text-[#8a584b] items-center font-semibold ">
          {/* <div className="font-normal">{aggregatedDiscountInfo.header}</div> */}
        </div>
      </div>
    )
  }

  export default RestrauntCard;