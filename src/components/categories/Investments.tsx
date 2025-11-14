import { Categories } from '@/utils/types';
import React from 'react';
import CategoryUI from './CategoryUI';

const Investments: React.FC = () => {
  return <CategoryUI category={Categories.INVESTMENTS} title="Investment Documents" />;
};

export default Investments;