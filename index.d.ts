interface IMessageDataResponse {
  body: {
    apiVersion: string,
    dateCreated: Date,
    dateSent: Date,
    dateUpdated: Date,
    direction: string,
    errorCode?: number,
    errorMessage?: string,
    numMedia: string,
    numSegments: string,
    price?: string,
    priceUnit?: string,
    sid: string,
    status: string,
  }
}
