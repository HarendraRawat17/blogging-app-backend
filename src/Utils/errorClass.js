export class customError extends Error{
  constructor(
    statusCode,
    message= "Something went wrong",
    ){
    super(message);
    this.statusCode = statusCode;
    this.message = message
  }
}


 