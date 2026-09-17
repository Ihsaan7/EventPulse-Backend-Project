const AsyncHandler = (reqestedHandler)=>
    {
        return (req , res , next)=>
            {
                Promise.resolve(reqestedHandler(req , res , next))
                    .catch((err)=> next(err))
            }
    }

export {AsyncHandler}