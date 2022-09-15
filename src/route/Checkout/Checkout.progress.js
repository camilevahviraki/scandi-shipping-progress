import React, { Component } from 'react';
import './Checkout.progress.scss';

export default class CheckoutProgress extends Component {
  constructor(props){
    super(props);
    
  }
  
  render() {

    let step = 0;
    const progressLink = localStorage.getItem('progress-link');
    if (progressLink.toLowerCase().includes('shipping')) {
        step = 1;
    }else if (progressLink.toLowerCase().includes('billing')) {
        step = 2;
    }else {
        step = 3;
    }
   
    console.log("Props", this.props);
    return (
      <div block="Checkout" elem="ProgressContainer">
          <div block="Checkout" elem="Progress">
             <div block="Progress" elem={step >= 1? "bar" :"bar-full"}>
                <div block="Progress" elem={step >= 1? "slide" :"slide-none"}></div>
              </div>
             <div block="Progress" elem="Step">
                <div block="Progress" elem={step >= 1? "Step-Span" :"Step-Span-full"}><span>{step >= 2? "V" :"1"}</span></div>
                <h4 block="Progress" elem={step >= 1? "title" :"title-full"}>Shopping</h4>
             </div>
             <div block="Progress" elem={step >= 2? "bar" :"bar-full"}>
             <div block="Progress" elem={step >= 2? "slide" :"slide-none"}></div>
              </div>
             <div block="Progress" elem="Step Step2">
               <div block="Progress" elem={step >= 2? "Step-Span" :"Step-Span-full"}><span>2</span></div>
               <h4 block="Progress" elem={step >= 2? "title" :"title-full"}>Reviews {'&'} Payments</h4>
            </div> 
             <div block="Progress" elem={step > 2? "bar" :"bar-full"}>
               <div block="Progress" elem={step >2? "slide" :"slide-none"}></div>
            </div>
          </div>
      </div>
    )
  }
}
