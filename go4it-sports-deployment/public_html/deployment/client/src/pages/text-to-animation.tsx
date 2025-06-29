import React from 'react';
import { Helmet } from 'react-helmet';
import QuantumAnimationStudio from '../components/animations/QuantumAnimationStudio';

export default function TextToAnimationPage() {
  return (
    <>
      <Helmet>
        <title>Text to Animation | Quantum Animation Studio</title>
      </Helmet>
      <QuantumAnimationStudio />
    </>
  );
}