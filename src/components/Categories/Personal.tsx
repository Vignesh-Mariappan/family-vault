import { Categories } from "@/utils/types";
import CategoryUI from "./CategoryUI";

const Personal: React.FC = () => {
	return (
		<CategoryUI category={Categories.PERSONAL} title="Personal Documents" />
	);
}

export default Personal;