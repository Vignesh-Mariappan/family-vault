import { Categories } from '@/utils/types';
import React from 'react';
import CategoryUI from './CategoryUI';

const Health: React.FC = () => {
  return <CategoryUI category={Categories.HEALTH} title="Health Documents" />;
};

export default Health;