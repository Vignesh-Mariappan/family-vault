import { Categories } from '@/utils/types';
import React from 'react';
import CategoryUI from './CategoryUI';

const Professional: React.FC = () => {
  return <CategoryUI category={Categories.PROFESSIONAL} title="Professional Documents" />;
};

export default Professional;