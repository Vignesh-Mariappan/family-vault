import { Categories } from '@/utils/types';
import React from 'react';
import CategoryUI from './CategoryUI';

const Educational: React.FC = () => {
    return (
		<CategoryUI category={Categories.EDUCATIONAL} title="Educational Documents" />
	);
};

export default Educational;