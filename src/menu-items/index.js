import dashboard from './dashboard';
import studentManagement from './studentManagement';
import teacherManagement from './teacherManagement';
import courseManagement from './courseManagement';
import resultManagement from './resultManagement';
import resultAnalysis from './resultAnalysis';
import teachercourseManagement from './teacher-courseManagement'
import user from './users';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, studentManagement,teacherManagement, courseManagement,teachercourseManagement,resultManagement, resultAnalysis,user]
};

export default menuItems;
