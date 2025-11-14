import { Outlet, useLocation, useParams } from 'react-router-dom';
import ShowCategories from '../components/categories/ShowCategories';

const CategoriesWrapper = () => {
  const { memberid } = useParams<{ memberid: string }>();
  const location = useLocation();
  const { userDisplayName } = location.state || {};

  const isBaseRoute = location.pathname === `/categories/${memberid}/`;

  return (
    <section className="flex flex-col gap-4 items-center">
      
      {isBaseRoute ? (
        // ✅ Show category cards only on base member route
        <ShowCategories userDisplayName={userDisplayName} />
      ) : (
        // ✅ Show Outlet only on category routes
        <div className="w-full">
          <Outlet />
        </div>
      )}
    </section>
  )
}

export default CategoriesWrapper