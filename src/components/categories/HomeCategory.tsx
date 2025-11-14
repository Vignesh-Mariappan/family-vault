import { Categories } from '@/utils/types';
import React from 'react';
import CategoryUI from './CategoryUI';

const HomeCategory: React.FC = () => {
  return <CategoryUI category={Categories.HOME} title="Home Documents" />;
};

export default HomeCategory;