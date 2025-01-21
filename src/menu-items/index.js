import dashboard from './dashboard';
import studentManagement from './studentManagement';
import teacherManagement from './teacherManagement';
import courseManagement from './courseManagement';
import resultManagement from './resultManagement';
import resultAnalysis from './resultAnalysis';
import performanceReports from './performanceReports';
import user from './users';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, studentManagement,teacherManagement, courseManagement,resultManagement, resultAnalysis, performanceReports,user]
};

export default menuItems;
