function throwErrorMessageEvent(code: any, message: string){
    const event = new CustomEvent('errorHappend',{
        detail: {
         response:{
            data: {
                code,message
            }
         }
        }
      });

      window.document.dispatchEvent(event);
}


export default throwErrorMessageEvent;