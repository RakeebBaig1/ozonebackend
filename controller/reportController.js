const asyncHandler = require("express-async-handler")
const Location = require('../models/baseLocations') 


module.exports.getUvReport = asyncHandler(async(req, res, next)=>{
    
    console.log("req", req.query)
    const { uv, type, from_date, to_date, location } = req.query
    try{
    
        if(!uv, !type, !from_date, !to_date, !location){
            res.status(400)
            throw new Error("Please provide all the required fields")
        }
        else{
            const desiredLocation = await Location.find({Location_Name: location})
                                        .populate("locationDetails", "Reading_Date Reading_Time UV_A_Value UV_B_Value")

            console.log("location", location)

            const detail = desiredLocation[0].locationDetails.filter(item=>{
                return item.Reading_Date >= from_date && item.Reading_Date <= to_date
            }).sort(( a, b)=> new Date(a.Reading_Date) - new Date(b.Reading_Date))
            
            if(!detail)
            {
                res.status(400)
                throw new Error("No data found between specified date range")
            } 

            const valuesByDates = {};

            detail.forEach(item => {
                if (!valuesByDates[item.Reading_Date]) {
                    valuesByDates[item.Reading_Date] = [];
                }
                valuesByDates[item.Reading_Date].push(item);
            });


            if(type === 'Hourly')
            {
                if(uv === 'UV_A')
                { 
                    const mappedValues = detail.map(reading=>
                        {
                            let obj = {}
                            obj.Reading_Date = reading.Reading_Date
                            obj.Reading_Time = reading.Reading_Time
                            obj.UV_A_Value = reading.UV_A_Value
                            return obj
                        })

                    res.status(200).json(mappedValues)
                }
                if(uv === 'UV_B'){
                const mappedValues = detail.map(reading=>
                    {
                        let obj = {}
                        obj.Reading_Date = reading.Reading_Date
                        obj.Reading_Time = reading.Reading_Time
                        obj.UV_B_Value = reading.UV_B_Value
                        return obj
                    })

                res.status(200).json(mappedValues)
            }

            }
            if(type === 'Daily')
            {
                if(uv === 'UV_A')
                {
                    // GET the highest UV_A value from the valuesByDate
                    const highestValuesByDates = {};

                    for (const date in valuesByDates) {
                        const dateArray = valuesByDates[date];
                        let highest_A = null;

                        dateArray.forEach(item => {
                            if (!highest_A || item.UV_A_Value > highest_A.UV_A_Value) {
                                highest_A = item;
                            }
                            console.log("highest A inside loop", highest_A)
                        });
                        console.log("highest A", highest_A)


                        highestValuesByDates[date] = highest_A
                    }

                    console.log("Highest UV_A value for each date:", highestValuesByDates);

                    res.json(highestValuesByDates)
                }

                if(uv === 'UV_B')
                {
                    // GET the highest UV_B value from the details
                    const highestValuesByDates = {};

                    for (const date in valuesByDates) {
                        const dateArray = valuesByDates[date];
                        let highest_B = null;

                        dateArray.forEach(item => {
                            if (!highest_B || item.UV_A_Value > highest_B.UV_A_Value) {
                                highest_B = item;
                            }
                            console.log("highest A inside loop", highest_B)
                        });
                        console.log("highest B", highest_B)


                        highestValuesByDates[date] = highest_B
                    }

                    console.log("Highest UV_B value for each date:", highestValuesByDates);

                    res.json(highestValuesByDates)
                }
            }
        }
    }catch(error)
    {
        res.status(400)
        throw new Error(error)
    }
}) 

module.exports.getOzoneReport = asyncHandler(async(req, res, next)=>{
    const { type, from_date, to_date, location } = req.query
    
    try{
        if(!type, !from_date, !to_date, !location){
            res.status(400)
            throw new Error("Please provide all the required fields")
        }
        else{
            const desiredLocation = await Location.find({Location_Name: location})
                                        .populate("locationDetails", "Reading_Date Reading_Time UV_A_Value UV_B_Value")

            const detail = desiredLocation[0].locationDetails.filter(item=>{
                return item.Reading_Date >= from_date && item.Reading_Date <= to_date
            }).sort((a, b)=> new Date(a.Reading_Date) - new Date(b.Reading_Date))

            if(!detail)
            {
                res.status(400)
                throw new Error("No data found between specified date range")
            } 

            if(type === 'Hourly') {
                    const ratio = detail.map(reading=>
                        {
                            let obj = {}
                            const UV_A = reading.UV_A_Value
                            const UV_B = reading.UV_B_Value
                            const ratio = UV_B/UV_A
                            obj.Reading_Date = reading.Reading_Date
                            obj.Reading_Time = reading.Reading_Time
                            obj.ratio =  ratio
                            obj.UV_A_Value = UV_A
                            obj.UV_B_Value = UV_B
                            return obj
                        })
                    res.status(200).json(ratio)
            }
            
            if(type === 'Daily')
            {
                
                const ozoneRatio = []
                const valuesByDate = {}

                //get separate arrays date wise
                detail.forEach((item)=>{
                    if(!valuesByDate[item.Reading_Date])
                    {
                        valuesByDate[item.Reading_Date] = []
                    }
                    valuesByDate[item.Reading_Date].push(item)
                })

                //get ratio value on daily basis against highest b value
                for( const date in valuesByDate)
                {
                    console.log("date", date)
                    const dataArray = valuesByDate[date]
                    let highest_B_Value = null

                    dataArray.forEach((item)=>{
                        if(!highest_B_Value || item.UV_B_Value > highest_B_Value.UV_B_Value)
                        {
                            highest_B_Value = item
                        }
                    })
                    console.log("highest b for date", highest_B_Value)

                    const ratio = highest_B_Value.UV_B_Value/highest_B_Value.UV_A_Value
                    const obj = {}
                    obj.Reading_Date = highest_B_Value.Reading_Date
                    obj.Reading_Time = highest_B_Value.Reading_Time
                    obj.UV_A_Value = highest_B_Value.UV_A_Value
                    obj.UV_B_Value = highest_B_Value.UV_B_Value
                    obj.ozone_ratio = ratio 
                    ozoneRatio.push(obj)
                }

                res.status(200).json(ozoneRatio)
            }

        }
    }catch(error)
    {
        res.status(400)
        throw new Error(error)
    }
})

