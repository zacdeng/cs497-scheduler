import { hasConflict } from '../utilities/times';

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
  
const Course = ({ course, selected, setSelected}) => {
    const isSelected = selected.includes(course); // return true or false
    const isDisabled = !isSelected && hasConflict(course, selected); // hasn't been selected and has conflict with already selected course
    const style = { 
    // set the background color for card-body, if disable => lightgrey, else lightgreen
    backgroundColor : isDisabled ? 'lightgrey' : isSelected ? 'rgba(17, 114, 59, 0.3)' : 'white' }; 
    return ( // if course is disabled, onClick will be null, can't click
    <div className="card m-2 p-2"
    style={style}
    onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}>
    <div className="card-body">
        <div className="card-title">{ getCourseTerm(course) } CS { getCourseNumber(course) }</div>
        <div className="card-text">{ course.title }</div>
        <div className="card-time">{ course.meets }</div>
    </div>
    </div>
    );
};

export default Course;