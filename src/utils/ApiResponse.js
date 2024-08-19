class ApiResponse extends Response {
  constructor(statusCode, data, message = "Success") {
    super(message);
    this.statusCode = statusCode < 400;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
