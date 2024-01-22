interface IMessageResponseData {
  body: {
    apiVersion: string,
    dateCreated: Date,
    dateSent: Date,
    dateUpdated: Date,
    direction: string,
    errorCode?: number,
    errorMessage?: string,
    from: string,
    numMedia: string,
    numSegments: string,
    price?: string,
    priceUnit?: string,
    sid: string,
    status: string,
    to: string,
  }
}

interface IMessageErrorData {
  error: {
    status: number,
    message: string
  }
}
