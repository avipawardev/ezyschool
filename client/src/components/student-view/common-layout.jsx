import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import MobileNumberDialog from "./mobile-number-dialog";

function StudentViewCommonLayout() {
  const location = useLocation();
  return (
    <div>
      {!location.pathname.includes("course-progress") ? (
        <StudentViewCommonHeader />
      ) : null}
      
      <MobileNumberDialog />
      <Outlet />
    </div>
  );
}

export default StudentViewCommonLayout;
