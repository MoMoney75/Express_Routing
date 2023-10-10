const express = require("express")
const app = express()


class expressError extends Error{
    constructor(message,status){
        super()
        this.message = message;
        this.status = status;
        console.error(this.stack)
    }
}

// query is a string of numbers seperated by commas: /mean?numbers=1,2,3,4,5


app.get('/mean', (request,response)=>{
    numbers = request.query.numbers
    nums = numbers.split(',')
    let total = 0
    nums.map((x) =>{
        const num = parseInt(x)
        if(isNaN(num)){
            throw new expressError("Bad Request, Please enter a valid number", 405)
        }

        else if(!num){
            throw new expressError("Bad Request, Numbers are required",400)
        }
        else{
        total += num
        mean = total/nums.length
    }
    })
   
    response.json({result:{method:"mean", value:mean}})
})

app.get('/median', (request, response) => {
    let numbers = request.query.numbers;
    let nums = numbers.split(',').map((x) => parseInt(x));
    if(nums.some(isNaN)){
        throw new expressError("Bad Request, Please enter a valid number", 405)
    }           
    
    else if(!nums){
        throw new expressError("Bad Request, Numbers are required",400)
    }
    const sorted = nums.sort((a, b) => a - b);

    let median;
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        median = (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
        median = sorted[middle];
    }
    response.json({ result: { method: "median", value: median } });
});


app.get('/mode', (request,response) => {
    let numbers = request.query.numbers;
    let nums = numbers.split(',').map((x) => parseInt(x));
    if(nums.some(isNaN)){
        throw new expressError("Bad Request, Please enter a valid number", 405)
    }

    else if(!nums){
        throw new expressError("Bad Request, Numbers are required",400)
    }

    const sorted = nums.sort((a, b) => a - b);

    const myObj = {}
    for(let i = 0; i <= sorted.length; i ++){
        if(myObj[sorted[i]]){
            myObj[sorted[i]] += 1
        }

        else{
            myObj[sorted[i]] = 1
        }

    }

    let biggestValue = -1
    let biggestValuesKey = -1

    Object.keys(myObj).forEach(key => {
        let value = myObj[key]
        if (value > biggestValue) {
          biggestValue = value
          biggestValuesKey = key
        }
      })
      response.json({ result: { method: "mode", value: biggestValuesKey } });
})


// Generic 404 handler error
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
  });
  
  // Generic internal server error
  app.use(function(err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.message;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {message, status}
    });
  });
app.listen(3000,()=>{console.log("server is up!")})
