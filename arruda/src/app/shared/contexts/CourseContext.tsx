import { createContext, useContext } from 'react';

interface ICourseProvider {
  children?: React.ReactNode;
}

// interface ICourse {
//   ?: string;
// }

const CourseContext = createContext({});
// export const useCourseContext = () => useContext(CourseContext);

// const CourseProvider: React.FC<ICourseProvider> = ({
//   children,
//   course,
// }: any) => {
//   return (
//     <CourseContext.Provider value={course}>{children}</CourseContext.Provider>
//   );
// };
export default CourseContext;
