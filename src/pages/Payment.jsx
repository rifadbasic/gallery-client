import { loadStripe  } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import CheckoutForm from '../components/CheckoutForm';


const stripePromise = loadStripe(`${import.meta.env.VITE_Publishable_Key}`);

const Payment = ( ) => {


  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm ></CheckoutForm>
    </Elements>
  );
};

export default Payment;