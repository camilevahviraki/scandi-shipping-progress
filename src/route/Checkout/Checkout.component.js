import {
    Checkout as SourceCheckout,
} from 'SourceRoute/Checkout/Checkout.component';

// import {
//     CheckoutOrderSummary
// } from 'SourceComponent/CheckoutOrderSummary/CheckoutOrderSummary.component';


import CartCoupon from 'SourceComponent/CartCoupon';
import CheckoutBilling from 'SourceComponent/CheckoutBilling';
import CheckoutGuestForm from 'SourceComponent/CheckoutGuestForm';
import CheckoutOrderSummary from 'SourceComponent/CheckoutOrderSummary';
import CheckoutShipping from 'SourceComponent/CheckoutShipping';
import CheckoutSuccess from 'SourceComponent/CheckoutSuccess';
import CmsBlock from 'SourceComponent/CmsBlock';
import ContentWrapper from 'SourceComponent/ContentWrapper';
import ExpandableContent from 'SourceComponent/ExpandableContent';
import { CHECKOUT, CHECKOUT_SUCCESS } from 'SourceComponent/Header/Header.config';
import Loader from 'SourceComponent/Loader';
import { addressType } from 'SourceType/Account';
import { paymentMethodsType, shippingMethodsType } from 'SourceType/Checkout';
import { HistoryType } from 'SourceType/Common';
import { TotalsType } from 'SourceType/MiniCart';
import { appendWithStoreCode } from 'SourceUtil/Url';
import CheckoutProgress from './Checkout.progress';

import {
    BILLING_STEP,
    CHECKOUT_URL,
    DETAILS_STEP,
    SHIPPING_STEP
} from 'SourceRoute/Checkout/Checkout.config';


export class Checkout extends SourceCheckout {
    // TODO implement logic

    stepMap = {
        [SHIPPING_STEP]: {
            title: __('Shipping step'),
            url: '/shipping',
            render: this.renderShippingStep.bind(this),
            areTotalsVisible: true,
            renderCartCoupon: this.renderCartCoupon.bind(this)
        },
        [BILLING_STEP]: {
            title: __('Billing step'),
            url: '/billing',
            render: this.renderBillingStep.bind(this),
            areTotalsVisible: true,
            renderCartCoupon: this.renderCartCoupon.bind(this)
        },
        [DETAILS_STEP]: {
            title: __('Thank you for your purchase!'),
            url: '/success',
            render: this.renderDetailsStep.bind(this),
            areTotalsVisible: false
        }
    };

    componentDidMount() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        this.updateHeader();

        history.replace(appendWithStoreCode(`${ CHECKOUT_URL }${ url }`));
    }

    componentDidUpdate(prevProps) {
        const { checkoutStep } = this.props;
        const { checkoutStep: prevCheckoutStep } = prevProps;

        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
            this.updateStep();
        }
    }

    updateHeader() {
        const { setHeaderState, checkoutStep, goBack } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        setHeaderState({
            name: checkoutStep === DETAILS_STEP ? CHECKOUT_SUCCESS : CHECKOUT,
            title,
            onBackClick: () => goBack()
        });
    }

    updateStep() {
        const { checkoutStep, history } = this.props;
        const { url } = this.stepMap[checkoutStep];

        history.push(appendWithStoreCode(`${ CHECKOUT_URL }${ url }`));
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        return (
            <h2 block="Checkout" elem="Title">
                { title }
            </h2>
        );
    }

    renderGuestForm() {
        const {
            checkoutStep,
            isCreateUser,
            onEmailChange,
            onCreateUserChange,
            onPasswordChange,
            isGuestEmailSaved
        } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm
              isBilling={ isBilling }
              isCreateUser={ isCreateUser }
              onEmailChange={ onEmailChange }
              onCreateUserChange={ onCreateUserChange }
              onPasswordChange={ onPasswordChange }
              isGuestEmailSaved={ isGuestEmailSaved }
            />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading,
            onPasswordChange,
            onCreateUserChange,
            onEmailChange,
            isCreateUser,
            estimateAddress
        } = this.props;

        return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
              onPasswordChange={ onPasswordChange }
              onCreateUserChange={ onCreateUserChange }
              onEmailChange={ onEmailChange }
              isCreateUser={ isCreateUser }
              estimateAddress={ estimateAddress }
            />
        );
    }

    renderBillingStep() {
        const {
            setLoading,
            setDetailsStep,
            shippingAddress,
            paymentMethods = [],
            savePaymentInformation,
            selectedShippingMethod
        } = this.props;

        return (
            <CheckoutBilling
              setLoading={ setLoading }
              paymentMethods={ paymentMethods }
              setDetailsStep={ setDetailsStep }
              shippingAddress={ shippingAddress }
              savePaymentInformation={ savePaymentInformation }
              selectedShippingMethod={ selectedShippingMethod }
            />
        );
    }

    renderDetailsStep() {
        const {
            orderID,
            isEmailAvailable,
            email,
            billingAddress: {
                firstname,
                lastname
            }
        } = this.props;

        return (
            <CheckoutSuccess
              email={ email }
              firstName={ firstname }
              lastName={ lastname }
              isEmailAvailable={ isEmailAvailable }
              orderID={ orderID }
            />
        );
    }

    renderStep() {
        const { checkoutStep } = this.props;
        const { render } = this.stepMap[checkoutStep];
        if (render) {
            return render();
        }

        return null;
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    renderSummary(showOnMobile = false) {
        const {
            checkoutTotals,
            checkoutStep,
            paymentTotals,
            isMobile,
            totals: { coupon_code },
            onCouponCodeUpdate
        } = this.props;
        const { areTotalsVisible } = this.stepMap[checkoutStep];

        if (!areTotalsVisible || (showOnMobile && !isMobile) || (!showOnMobile && isMobile)) {
            return null;
        }

        return (
            <CheckoutOrderSummary
              checkoutStep={ checkoutStep }
              totals={ checkoutTotals }
              paymentTotals={ paymentTotals }
              isExpandable={ isMobile }
              couponCode={ coupon_code }
              // eslint-disable-next-line react/jsx-no-bind
              renderCmsBlock={ () => this.renderPromo(true) }
              onCouponCodeUpdate={ onCouponCodeUpdate }
            />
        );
    }

    renderCoupon() {
        const { checkoutStep } = this.props;
        const { renderCartCoupon } = this.stepMap[checkoutStep];

        if (renderCartCoupon) {
            return renderCartCoupon();
        }

        return null;
    }

    renderCartCoupon() {
        const {
            totals: { coupon_code },
            isMobile,
            onCouponCodeUpdate,
            checkoutStep
        } = this.props;

        if (isMobile || checkoutStep === SHIPPING_STEP) {
            return null;
        }

        return (
            <ExpandableContent
              heading={ __('Have a discount code?') }
              mix={ { block: 'Checkout', elem: 'Coupon' } }
            >
                <CartCoupon
                  couponCode={ coupon_code }
                  onCouponCodeUpdate={ onCouponCodeUpdate }
                />
            </ExpandableContent>
        );
    }

    renderPromo(showOnMobile = false) {
        const { checkoutStep, isMobile } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        if (!showOnMobile && isMobile) {
            return null;
        }

        const {
            checkout_content: {
                [isBilling ? 'checkout_billing_cms' : 'checkout_shipping_cms']: promo
            } = {}
        } = window.contentConfiguration;

        if (!promo) {
            return null;
        }

        return <CmsBlock identifier={ promo } />;
    }

    render() {
        localStorage.setItem('progress-link', window.location.pathname.split('/').join(''));
        return (
            <main block="Checkout">
                <CheckoutProgress data={this.props}/>
                <ContentWrapper
                  wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                  label={ __('Checkout page') }
                >
                    { this.renderSummary(true) }
                    <div block="Checkout" elem="Step">
                        { this.renderTitle() }
                        { this.renderGuestForm() }
                        { this.renderStep() }
                        { this.renderLoader() }
                    </div>
                    <div>
                        { this.renderSummary() }
                        { this.renderPromo() }
                        { this.renderCoupon() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
};

export default Checkout;
