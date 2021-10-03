import { hasConflict, timeParts } from '../utilities/times';
import { setData, useUserState } from '../utilities/firebase';

export const terms = { F: 'Fall', W: 'Winter', S: 'Spring'}; 

const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y!==x) : [x, ...lst]
)

export const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);
  
const getCourseNumber = course => (
    course.id.slice(1, 4)
);

const getCourseMeetingData = course => {
    const meets = prompt('Enter meeting data: MTuWThF hh:mm-hh:mm', course.meets);
    const valid = !meets || timeParts(meets).days;
    if (valid) return meets;
    alert('Invalid meeting data');
    return null;
};

const reschedule = async (course, meets) => {
    if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
      try {
        await setData(`/courses/${course.id}/meets`, meets);
      } catch (error) {
        alert(error);
      }
    }
};

const Course = ({ course, selected, setSelected}) => {
    const isSelected = selected.includes(course); // return true or false
    const isDisabled = !isSelected && hasConflict(course, selected); // hasn't been selected and has conflict with already selected course
    const [user] = useUserState();
    const style = { 
    // set the background color for card-body, if disable => lightgrey, else lightgreen
    backgroundColor : isDisabled ? 'lightgrey' : isSelected ? 'rgba(17, 114, 59, 0.3)' : 'white' }; 
    return ( // if course is disabled, onClick will be null, can't click
    <div className="card m-2 p-2"
    style={style}
    onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
    onDoubleClick={!user ? null : () => reschedule(course, getCourseMeetingData(course))}>
    <div className="card-body">
        <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
        <div className="card-text">{ course.title }</div>
        <div className="card-time">{ course.meets }</div>
    </div>
    </div>
    );
};

export default Course;