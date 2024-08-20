export const morganFormat = ":method :url :status :response-time ms";

export function customise(message) {
  const logObject = {
    method: message.split(" ")[0],
    url: message.split(" ")[1],
    status: message.split(" ")[2],
    responseTime: message.split(" ")[3],
  };
  return logObject;
}
