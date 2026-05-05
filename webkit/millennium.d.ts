declare const Millennium: {
  callServerMethod: (methodName: string, kwargs?: any) => Promise<any>;
  findElement: (privateDocument: Document, querySelector: string, timeOut?: number) => Promise<NodeListOf<Element>>;
};
