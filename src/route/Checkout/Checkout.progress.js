import { mapStateToProps } from '@scandipwa/scandipwa/src/component/CartCoupon/CartCoupon.container';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Checkout.progress.scss';

class CheckoutProgress extends Component {
  constructor(props){
    super(props);
    
  }
  
  render() {

    let step = 0;
    const cartLength = this.props.store.CartReducer.cartTotals.items_qty;
    const progressLink = localStorage.getItem('progress-link');
    if (progressLink.toLowerCase().includes('shipping') && cartLength !== 0) {
        step = 1;
    }else if (progressLink.toLowerCase().includes('billing')&& cartLength !== 0) {
        step = 2;
    }else if( cartLength === 0){
        step = 3;
    }
   
    // console.log("Props", this.props.store.CartReducer.cartTotals.items_qty);
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
             <div block="Progress" elem={step >= 2? "slide" :"slide-none"} style={{animationDelay: '2.5s'}}></div>
              </div>
             <div block="Progress" elem="Step Step2">
               <div block="Progress" elem={step >= 2? "Step-Span" :"Step-Span-full"}><span>2</span></div>
               <h4 block="Progress" elem={step >= 2? "title" :"title-full"}>Reviews {'&'} Payments</h4>
            </div> 
             <div block="Progress" elem={step > 2? "bar" :"bar-full"}>
               <div block="Progress" elem={step >2? "slide" :"slide-none"} style={{animationDelay: '5s'}}></div>
            </div>
          </div>
      </div>
    )
  }
}

const mapState = (state) => ({store: state});

export default connect(mapState)(CheckoutProgress);
